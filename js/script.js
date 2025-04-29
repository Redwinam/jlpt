// --- 核心数据结构 (更新版) ---
const contentData = {
  "n1-kanji": {
    navTitle: "N1级 汉字",
    level: "N1级",
    category: "汉字",
    levelColor: "purple",
    categoryColor: "red",
    basePath: "N1 - 汉字/",
    sections: [
      {
        title: "第1部　訓読み",
        groups: [
          {
            title: "第1回",
            items: [
              { name: "動詞Aレベル (1)", id: "s1-g1-i1", file: "1-1", page: "3" },
              { name: "動詞Aレベル (2)", id: "s1-g1-i2", file: "1-2", page: "4" },
              { name: "動詞Aレベル (3)", id: "s1-g1-i3", file: "1-3", page: "5" },
            ],
          },
          {
            title: "第2回",
            items: [
              { name: "動詞Aレベル (1)", id: "s1-g2-i1", file: "2-1", page: "8" },
              { name: "動詞Aレベル (2)", id: "s1-g2-i2", file: "2-2", page: "9" },
              { name: "動詞Aレベル (3)", id: "s1-g2-i3", file: "2-3", page: "10" },
              { name: "動詞Aレベル (4)", id: "s1-g2-i4", file: "2-4", page: "11" },
            ],
          },
          { title: "第3回", items: [{ name: "動詞Bレベル", id: "s1-g3-i1", file: "3-1", page: "15-17" }] },
          { title: "第4回", items: [{ name: "動詞Bレベル", id: "s1-g4-i1", file: "4-1", page: "21-23" }] },
          { title: "第5回", items: [{ name: "動詞Cレベル", id: "s1-g5-i1", file: "5-1", page: "27-29" }] },
          { title: "第6回", items: [{ name: "動詞Cレベル", id: "s1-g6-i1", file: "6-1", page: "33-35" }] },
          { title: "第7回", items: [{ name: "い形容詞", id: "s1-g7-i1", file: "7-1", page: "38-39" }] },
          {
            title: "第8回",
            items: [
              { name: "な形容詞", id: "s1-g8-i1", file: "8-1", page: "42" },
              { name: "副詞・その他", id: "s1-g8-i2", file: "8-2", page: "43" },
            ],
          },
          {
            title: "第9回",
            items: [
              { name: "名詞 (1) 道具", id: "s1-g9-i1", file: "9-1", page: "46" },
              { name: "名詞 (2) 人・衣服", id: "s1-g9-i2", file: "9-2", page: "47" },
              { name: "名詞 (3) 身体・感情", id: "s1-g9-i3", file: "9-3", page: "48" },
            ],
          },
          {
            title: "第10回",
            items: [
              { name: "名詞 (4) 自然", id: "s1-g10-i1", file: "10-1", page: "51" },
              { name: "名詞 (5) 植物・食物", id: "s1-g10-i2", file: "10-2", page: "52" },
              { name: "名詞 (6) 建造物・形状", id: "s1-g10-i3", file: "10-3", page: "53" },
            ],
          },
          {
            title: "第11回",
            items: [
              { name: "名詞 (7) 野生・生活", id: "s1-g11-i1", file: "11-1", page: "55" },
              { name: "名詞 (8) 経済・生活", id: "s1-g11-i2", file: "11-2", page: "56" },
              { name: "名詞 (9) 時・空間", id: "s1-g11-i3", file: "11-3", page: "57" },
            ],
          },
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
      cell4Text = cell4Text.replace(/（[自他]）[。]?/g, "\n").trim();
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

  // 将所有全角斜杠替换为换行符
  textToCopy = textToCopy.replace(/／/g, "\n");

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
    sections.forEach((section, sectionIndex) => {
      if (section.groups && section.groups.length > 0) {
        section.groups.forEach((group, groupIndex) => {
          const groupLi = document.createElement("li");
          groupLi.textContent = group.title;
          groupLi.classList.add("toc-group");

          const itemsUl = document.createElement("ul");

          if (group.items && group.items.length > 0) {
            group.items.forEach((item, itemIndex) => {
              const itemLi = document.createElement("li");
              const a = document.createElement("a");
              const tocTitle = item.name;
              a.href = `#container-${item.id}`;
              a.textContent = tocTitle;
              a.title = tocTitle;

              a.addEventListener("click", (e) => {
                e.preventDefault();
                const targetElement = document.getElementById(`container-${item.id}`);
                if (targetElement) {
                  targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  console.warn(`无法找到 TOC 目标元素: #container-${item.id}`);
                }
              });
              itemLi.appendChild(a);
              itemsUl.appendChild(itemLi);
            });
          }
          groupLi.appendChild(itemsUl);
          tocList.appendChild(groupLi);
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
      const levelColor = source.levelColor || "purple";
      h1Title += `<mark class="highlighted ${levelColor}">${source.level}</mark> `;
    }
    if (source.category) {
      const categoryColor = source.categoryColor || "red";
      h1Title += `<mark class="highlighted ${categoryColor}">${source.category}</mark>`;
    }
    const h1Id = `title-${contentType}`.replace(/[^a-zA-Z0-9-_]/g, "-");
    let initialHtml = `<h1 id="${h1Id}">${h1Title}</h1>`;
    // --- 更新结束 ---

    // --- 修改: 基于 groups 构建初始 HTML 结构 ---
    source.sections.forEach((section) => {
      const sectionTitleId = `section-${section.title.replace(/[^a-zA-Z0-9-_]/g, "-")}`; // Keep section title H2
      initialHtml += `<h2 id="${sectionTitleId}">${section.title}</h2>`;
      if (section.groups) {
        section.groups.forEach((group) => {
          // Create a container for each group's items
          const groupContainerId = `group-container-${group.title.replace(/[^a-zA-Z0-9-_]/g, "-")}`;
          initialHtml += `<div id="${groupContainerId}" class="group-content" data-group-title="${group.title}">`;
          // Optional: Add H3 for group title if needed, or rely on TOC structure
          // initialHtml += `<h3>${group.title}</h3>`;
          if (group.items) {
            group.items.forEach((item) => {
              // Pre-create the container for each item's content
              const itemContainerId = `container-${item.id}`;
              // Add placeholder or leave empty until loaded
              initialHtml += `<div class="fragment-container" id="${itemContainerId}" data-item-id="${item.id}"></div>`;
            });
          }
          initialHtml += `</div>`; // Close group container
        });
      }
    });
    contentArea.innerHTML = initialHtml;
    tocList.innerHTML = "<li>加载中...</li>"; // Keep loading indicator for TOC
    // --- 修改结束 ---

    // --- 修改: 扁平化 items 并使用 item.file 加载 ---
    const allItems = source.sections.flatMap((s) => s.groups || []).flatMap((g) => g.items || []);
    const itemPromises = allItems.map(async (item) => {
      // 使用 item.file 构建路径
      const filePath = `${source.basePath}${item.file}.html`;
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for ${filePath}`);
        }
        const fragmentHtml = await response.text();
        // Return the item itself along with HTML for context
        return { item: item, html: fragmentHtml, success: true };
      } catch (error) {
        console.error(`加载片段失败: ${filePath}`, error);
        // Return item to identify which one failed
        return { item: item, html: `<p style="color: red;">加载失败: ${item.name} (${filePath})</p>`, success: false };
      }
    });

    const loadedResults = await Promise.all(itemPromises);

    // --- 修改: 将加载的内容放入对应的 item container 中 ---
    loadedResults.forEach((result) => {
      const itemContainer = contentArea.querySelector(`#container-${result.item.id}`);
      if (itemContainer) {
        itemContainer.innerHTML = result.html;

        // --- 修改: 使用 item.id 查找 caption 并添加页码/按钮 ---
        if (result.success) {
          // Find the caption using the NEW item ID
          // Assumes the caption element's ID in the HTML has been updated to item.id
          const caption = itemContainer.querySelector(`#${CSS.escape(result.item.id)}`);

          if (caption && caption.tagName === "CAPTION") {
            const pageInfo = result.item.page; // Get page from item

            // Check if span already exists to prevent duplicates
            if (!caption.querySelector(".page-info-span")) {
              const pageSpan = document.createElement("span");
              pageSpan.textContent = ` P${pageInfo}`;
              pageSpan.classList.add("page-info-span");
              pageSpan.style.color = "var(--base-text-secondary-color, #888888)";
              pageSpan.style.fontSize = "0.9rem";
              pageSpan.style.cursor = "pointer";
              pageSpan.style.fontWeight = "normal";
              // Pass the NEW item ID to the copy function
              pageSpan.onclick = (e) => {
                e.stopPropagation();
                copyTableColumns(result.item.id); // Use item.id here
              };
              caption.appendChild(pageSpan);
            }
          } else if (caption) {
            // Found element with item.id, but it's not a CAPTION
            console.warn(`找到 ID 为 ${result.item.id} 的元素, 但它不是 CAPTION。`);
          } else {
            // item.id not found within the loaded HTML for this item
            // console.warn(`在为 ${result.item.name} 加载的 HTML 中找不到 ID: ${result.item.id}`);
          }
        }
        // --- 修改结束 ---
      } else {
        console.error(`无法找到项目容器: #container-${result.item.id}`);
      }
    });
    // --- 修改结束 ---

    // Generate TOC after content structure is potentially updated
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
