// --- 核心数据结构 (更新版) ---
const contentData = {
  "n1-kanji": {
    navTitle: "N1级 汉字",
    level: "N1级", // <--- 新增 level
    category: "汉字", // <--- 新增 category
    levelColor: "purple", // <--- (可选) 等级颜色
    categoryColor: "red", // <--- (可选) 类别颜色
    basePath: "N1 - 汉字/",
    sections: [
      {
        title: "第1部　訓読み",
        fragments: [
          { id: "第1回　動詞Aレベル" },
          { id: "第2回　動詞Aレベル" },
          { id: "第3回　動詞Bレベル" },
          { id: "第4回　動詞Bレベル" },
          { id: "第5回　動詞Cレベル" },
          { id: "第6回　動詞Cレベル" },
          { id: "第7回　い形容詞" },
          { id: "第8回　な形容詞" },
          { id: "第8回　副詞・その他" },
          { id: "第9回　名詞　(1) 道具" },
          { id: "第9回　名詞　(2) 人・衣服" },
          { id: "第9回　名詞　(3) 身体・感情" },
          { id: "第10回　名詞　(4) 自然　(5) 植物・食物　(6) 建造物・形状" },
          { id: "第11回　名詞　(7) 野生・生活　(8) 経済・生活　(9) 時・空間" },
        ],
      },
    ],
  },
  // 未来可以添加其他类型
};
// --- 核心数据结构结束 ---

function copyTableColumns(captionId) {
  const captionElement = document.getElementById(captionId);
  if (!captionElement) {
    console.error("找不到 Caption 元素: " + captionId);
    return;
  }

  // 获取 caption 的文本内容 (第一个文本节点，避免获取按钮文字)
  const captionTitleRaw = captionElement.firstChild?.textContent?.trim() || "未知标题";
  const captionTitleProcessed = captionTitleRaw.replace(/\u3000/g, "\n"); // 将全角空格替换为换行符
  let textToCopy = captionTitleProcessed + "\n\n"; // 使用处理后的标题初始化，并添加换行

  let tableElement = captionElement.closest("table");
  if (!tableElement) {
    tableElement = captionElement.parentElement.tagName === "TABLE" ? captionElement.parentElement : null;
  }

  if (!tableElement) {
    console.error("找不到父级 Table 元素 for caption:" + captionId);
    return;
  }

  const tbody = tableElement.querySelector("tbody");
  if (!tbody) {
    console.error("找不到 tbody for table related to caption:" + captionId);
    return;
  }

  const rows = tbody.querySelectorAll("tr");

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length >= 4) {
      const cell3Text = cells[2].textContent.trim();
      let cell4Text = cells[3].textContent.trim();
      cell4Text = cell4Text.replace(/（[自他]）[。]?/g, "").trim();
      if (cell4Text && !cell4Text.endsWith("。")) {
        cell4Text += "。";
      }
      if (cell3Text || cell4Text) {
        // 将单元格内容追加到标题后面
        textToCopy += cell3Text + "\n" + cell4Text + "\n\n";
      }
    } else {
      console.warn("行单元格数量不足:", row);
    }
  });

  textToCopy = textToCopy.trim();

  if (textToCopy) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        showNotification("已复制到剪贴板！");
      })
      .catch((err) => {
        console.error("无法复制文本: ", err);
        alert("复制失败！请检查浏览器权限或控制台错误信息。");
      });
  } else {
    alert("表格中没有可复制的内容。");
  }
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.left = "50%";
  notification.style.transform = "translateX(-50%)";
  notification.style.padding = "10px 20px";
  notification.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  notification.style.color = "white";
  notification.style.borderRadius = "5px";
  notification.style.zIndex = "1000";
  notification.style.opacity = "0";
  notification.style.transition = "opacity 0.5s ease-in-out";

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "1";
  }, 10);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.addEventListener("transitionend", () => {
      notification.remove();
    });
  }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  const contentArea = document.getElementById("content-area");
  const tocList = document.querySelector("#toc ul");
  const topNav = document.querySelector(".top-nav ul");

  // Generate TOC function (using simplified JSON)
  function generateTOC(contentType) {
    tocList.innerHTML = "";
    if (!contentData[contentType] || !contentData[contentType].sections) {
      tocList.innerHTML = "<li>无目录项</li>";
      return;
    }

    const sections = contentData[contentType].sections;
    sections.forEach((section) => {
      if (section.fragments && section.fragments.length > 0) {
        section.fragments.forEach((fragment) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          const tocTitle = fragment.tocTitle || fragment.id;
          a.href = `#${fragment.id}`;
          a.textContent = tocTitle;
          a.title = tocTitle;

          a.addEventListener("click", (e) => {
            e.preventDefault();
            const targetElement = document.getElementById(fragment.id);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
              console.warn(`无法找到 TOC 目标元素: #${fragment.id}`);
            }
          });
          li.appendChild(a);
          tocList.appendChild(li);
        });
      }
    });
    if (tocList.children.length === 0) {
      tocList.innerHTML = "<li>无目录项</li>";
    }
  }

  // Load content function (using simplified JSON, getElementById, and dynamic H1)
  async function loadContent(contentType) {
    if (!contentData[contentType]) {
      contentArea.innerHTML = "<h1>错误：未定义的内容类型</h1>";
      tocList.innerHTML = "";
      return;
    }

    const source = contentData[contentType];

    // --- 更新: 动态生成 H1 ---
    let h1Title = `新完全掌握日语能力考试 `;
    if (source.level) {
      const levelColor = source.levelColor || "purple"; // 默认紫色
      h1Title += `<mark class="highlighted ${levelColor}">${source.level}</mark> `;
    }
    if (source.category) {
      const categoryColor = source.categoryColor || "red"; // 默认红色
      h1Title += `<mark class="highlighted ${categoryColor}">${source.category}</mark>`;
    }
    // 创建一个基于 contentType 的安全 ID (可选，但有助于区分)
    const h1Id = `title-${contentType}`.replace(/[^a-zA-Z0-9-_]/g, "-");
    let initialHtml = `<h1 id="${h1Id}">${h1Title}</h1>`;
    // --- 更新结束 ---

    source.sections.forEach((section) => {
      const sectionId = `section-${section.title.replace(/[^a-zA-Z0-9-_]/g, "-")}`;
      initialHtml += `<h2 id="${sectionId}">${section.title}</h2>`;
      initialHtml += `<div class="section-content" data-section-title="${section.title}"></div>`;
    });
    contentArea.innerHTML = initialHtml;
    tocList.innerHTML = "<li>加载中...</li>";

    const allFragments = source.sections.flatMap((s) => s.fragments || []);
    const fragmentPromises = allFragments.map(async (fragment) => {
      const filePath = `${source.basePath}${fragment.id}.html`;
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for ${filePath}`);
        }
        const fragmentHtml = await response.text();
        return { id: fragment.id, html: fragmentHtml, success: true };
      } catch (error) {
        console.error(`加载片段失败: ${filePath}`, error);
        return { id: fragment.id, html: `<p style="color: red;">加载失败: ${filePath}</p>`, success: false };
      }
    });

    const loadedResults = await Promise.all(fragmentPromises);

    source.sections.forEach((section) => {
      const sectionContainer = contentArea.querySelector(`.section-content[data-section-title="${section.title}"]`);
      if (!sectionContainer) return;

      let sectionHtmlContent = "";
      const fragmentsInSection = loadedResults.filter((r) => section.fragments.some((f) => f.id === r.id));

      fragmentsInSection.forEach((result) => {
        const containerId = `container-${result.id}`;
        sectionHtmlContent += `<div class="fragment-container" id="${containerId}">${result.html}</div>`;
      });
      sectionContainer.innerHTML = sectionHtmlContent;

      fragmentsInSection.forEach((result) => {
        if (result.success) {
          const caption = document.getElementById(result.id);
          if (caption && caption.tagName === "CAPTION") {
            const button = document.createElement("button");
            button.textContent = "复制读音和例句";
            button.classList.add("copy-button");
            button.onclick = () => copyTableColumns(result.id);
            caption.appendChild(button);
            caption.style.position = "relative";
          } else if (caption) {
            console.warn(`Found element with id ${result.id}, but it's not a caption.`);
          }
        }
      });
    });

    generateTOC(contentType);
  }

  // Navigation click handler (remains the same)
  topNav.addEventListener("click", (e) => {
    if (e.target.tagName === "A" && e.target.dataset.contentType) {
      e.preventDefault();
      const contentType = e.target.dataset.contentType;
      if (!contentData[contentType]) {
        console.error("无效的内容类型:", contentType);
        return;
      }
      topNav.querySelectorAll("a").forEach((link) => link.classList.remove("active"));
      e.target.classList.add("active");
      loadContent(contentType);
    }
  });

  // Initial load (remains the same)
  const defaultContentType = "n1-kanji";
  const defaultNavLink = topNav.querySelector(`a[data-content-type="${defaultContentType}"]`);
  if (defaultNavLink && contentData[defaultContentType]) {
    defaultNavLink.classList.add("active");
    loadContent(defaultContentType);
  } else if (Object.keys(contentData).length > 0) {
    const firstContentType = Object.keys(contentData)[0];
    const firstNavLink = topNav.querySelector(`a[data-content-type="${firstContentType}"]`);
    if (firstNavLink && contentData[firstContentType]) {
      firstNavLink.classList.add("active");
      loadContent(firstContentType);
    } else {
      contentArea.innerHTML = "<h1>没有可加载的内容</h1>";
      tocList.innerHTML = "";
    }
  } else {
    contentArea.innerHTML = "<h1>没有可加载的内容</h1>";
    tocList.innerHTML = "";
  }
});
