// --- 核心数据结构 (简化版) ---
const contentData = {
  "n1-kanji": {
    navTitle: "N1级 汉字",
    pageTitle: "新完全掌握日语能力考试 N1级 汉字",
    basePath: "N1 - 汉字/", // <--- 新增基础路径
    sections: [
      {
        title: "第1部　訓読み",
        fragments: [
          // <--- 只需 ID
          { id: "第1回　動詞Aレベル" },
          { id: "第2回　動詞Aレベル" },
          { id: "第3回　動詞Bレベル" },
          { id: "第4回　動詞Bレベル" },
          { id: "第5回　動詞Cレベル" },
          { id: "第6回　動詞Cレベル" },
          { id: "第7回　い形容詞" },
          { id: "第8回　な形容詞　副詞・その他" },
          { id: "第9回　名詞　(1) 道具" },
          { id: "第9回　名詞　(2) 人・衣服" },
          { id: "第9回　名詞　(3) 身体・感情" },
          { id: "第10回　名詞　(4) 自然　(5) 植物・食物　(6) 建造物・形状" },
          { id: "第11回　名詞　(7) 野生・生活　(8) 経済・生活　(9) 時・空間" },
        ],
      },
    ],
  },
};
// --- 核心数据结构结束 ---

function copyTableColumns(captionId) {
  const captionElement = document.getElementById(captionId);
  if (!captionElement) {
    console.error("找不到 Caption 元素: " + captionId);
    return;
  }

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

  let textToCopy = "";
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

  // --- 重构: generateTOC 函数 (使用简化后的 JSON) ---
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
          const tocTitle = fragment.tocTitle || fragment.id; // 优先用 JSON 中定义的，否则用 id
          a.href = `#${fragment.id}`;
          a.textContent = tocTitle;
          a.title = tocTitle; // Use the same for tooltip

          a.addEventListener("click", (e) => {
            e.preventDefault();
            const targetElement = document.getElementById(fragment.id); // Use getElementById
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
  // --- 重构结束 ---

  // --- 重构: loadContent 函数 (使用简化后的 JSON 和 getElementById) ---
  async function loadContent(contentType) {
    if (!contentData[contentType]) {
      contentArea.innerHTML = "<h1>错误：未定义的内容类型</h1>";
      tocList.innerHTML = "";
      return;
    }

    const source = contentData[contentType];
    let initialHtml = `<h1>${source.pageTitle}</h1>`;
    source.sections.forEach((section) => {
      // Create a safe ID for the section header if needed
      const sectionId = `section-${section.title.replace(/[^a-zA-Z0-9-_]/g, "-")}`;
      initialHtml += `<h2 id="${sectionId}">${section.title}</h2>`;
      initialHtml += `<div class="section-content" data-section-title="${section.title}"></div>`;
    });
    contentArea.innerHTML = initialHtml;
    tocList.innerHTML = "<li>加载中...</li>";

    // 2. 异步加载所有片段
    const allFragments = source.sections.flatMap((s) => s.fragments || []);
    const fragmentPromises = allFragments.map(async (fragment) => {
      // --- 动态生成 filePath ---
      const filePath = `${source.basePath}${fragment.id}.html`;
      // ---
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for ${filePath}`);
        }
        const fragmentHtml = await response.text();
        // Pass fragment id along with html
        return { id: fragment.id, html: fragmentHtml, success: true };
      } catch (error) {
        console.error(`加载片段失败: ${filePath}`, error);
        return { id: fragment.id, html: `<p style="color: red;">加载失败: ${filePath}</p>`, success: false };
      }
    });

    const loadedResults = await Promise.all(fragmentPromises);

    // 4. 将加载的 HTML 插入到对应的 section 容器中
    source.sections.forEach((section) => {
      const sectionContainer = contentArea.querySelector(`.section-content[data-section-title="${section.title}"]`);
      if (!sectionContainer) return;

      let sectionHtmlContent = "";
      const fragmentsInSection = loadedResults.filter((r) => section.fragments.some((f) => f.id === r.id)); // Match by id

      fragmentsInSection.forEach((result) => {
        // --- 使用 getElementById 安全的容器 ID ---
        const containerId = `container-${result.id}`;
        // Inject the fragment HTML into its container
        sectionHtmlContent += `<div class="fragment-container" id="${containerId}">${result.html}</div>`;
        // ---
      });
      sectionContainer.innerHTML = sectionHtmlContent;

      // 5. 在内容插入后，为每个片段的 caption 添加按钮 (使用 getElementById)
      fragmentsInSection.forEach((result) => {
        if (result.success) {
          // --- 使用 getElementById 查找 caption ---
          const caption = document.getElementById(result.id);
          // ---
          if (caption && caption.tagName === "CAPTION") {
            // Verify it's a caption
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

    // 6. 最后生成 TOC
    generateTOC(contentType);
  }
  // --- 重构结束 ---

  // 导航点击事件处理 (基本不变)
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

  // 初始加载默认内容 (基本不变)
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
