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
              { name: "動詞Aレベル (4)", id: "s1-g2-i1", file: "2-1", page: "8" },
              { name: "動詞Aレベル (5)", id: "s1-g2-i2", file: "2-2", page: "9" },
              { name: "動詞Aレベル (6)", id: "s1-g2-i3", file: "2-3", page: "10" },
              { name: "動詞Aレベル (7)", id: "s1-g2-i4", file: "2-4", page: "11" },
            ],
          },
          {
            title: "第3回",
            items: [
              { name: "動詞Bレベル (1)", id: "s1-g3-i1", file: "3-1", page: "15" },
              { name: "動詞Bレベル (2)", id: "s1-g3-i2", file: "3-2", page: "16" },
              { name: "動詞Bレベル (3)", id: "s1-g3-i3", file: "3-3", page: "17" },
            ],
          },
          {
            title: "第4回",
            items: [
              { name: "動詞Bレベル (4)", id: "s1-g4-i1", file: "4-1", page: "21" },
              { name: "動詞Bレベル (5)", id: "s1-g4-i2", file: "4-2", page: "22" },
              { name: "動詞Bレベル (6)", id: "s1-g4-i3", file: "4-3", page: "23" },
            ],
          },
          {
            title: "第5回",
            items: [
              { name: "動詞Cレベル (1)", id: "s1-g5-i1", file: "5-1", page: "27" },
              { name: "動詞Cレベル (2)", id: "s1-g5-i2", file: "5-2", page: "28" },
              { name: "動詞Cレベル (3)", id: "s1-g5-i3", file: "5-3", page: "29" },
            ],
          },
          {
            title: "第6回",
            items: [
              { name: "動詞Cレベル (4)", id: "s1-g6-i1", file: "6-1", page: "33" },
              { name: "動詞Cレベル (5)", id: "s1-g6-i2", file: "6-2", page: "34" },
              { name: "動詞Cレベル (6)", id: "s1-g6-i3", file: "6-3", page: "35" },
            ],
          },
          {
            title: "第7回",
            items: [
              { name: "い形容詞 (1)", id: "s1-g7-i1", file: "7-1", page: "38" },
              { name: "い形容詞 (2)", id: "s1-g7-i2", file: "7-2", page: "39" },
            ],
          },
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

// 全局状态变量，用于跟踪例句显示模式 ('split' 或 'merged')
let globalExampleViewMode = "split";
// 新增: 全局状态变量，用于跟踪标题布局模式 ('horizontal' 或 'vertical')
let globalCaptionLayoutMode = "horizontal";

// --- 修改: 设置单个表格的视图模式，保留 HTML ---
function setTableViewMode(table, mode) {
  // 给 table 添加/移除状态类
  if (mode === "merged") {
    table.classList.add("table-merged-view");
  } else {
    table.classList.remove("table-merged-view");
  }

  const theadRow = table.querySelector("thead tr");
  const tbodyRows = table.querySelectorAll("tbody tr");
  const headerCells = theadRow ? theadRow.querySelectorAll("th") : [];
  // 假设日文例句是第4列(索引3)，中文翻译是第5列(索引4)
  const japaneseColIndex = 3;
  const chineseColIndex = 4;

  // 更新表头
  if (headerCells.length > chineseColIndex) {
    const thJapanese = headerCells[japaneseColIndex];
    const thChinese = headerCells[chineseColIndex];
    if (mode === "merged") {
      // 存储原始文本（如果尚未存储）
      if (!thJapanese.dataset.originalText) thJapanese.dataset.originalText = thJapanese.textContent;
      if (!thChinese.dataset.originalText) thChinese.dataset.originalText = thChinese.textContent;

      thJapanese.textContent = "例句";
      thChinese.classList.add("cell-collapsed");
    } else {
      // mode === 'split'
      // 恢复原始文本
      thJapanese.textContent = thJapanese.dataset.originalText || "日文例句";
      thChinese.textContent = thChinese.dataset.originalText || "中文翻译";
      thChinese.classList.remove("cell-collapsed");
    }
  }

  // 更新表体
  tbodyRows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length > chineseColIndex) {
      const tdJapanese = cells[japaneseColIndex];
      const tdChinese = cells[chineseColIndex];

      // 确保两个单元格都存在
      if (!tdJapanese || !tdChinese) return;

      if (mode === "merged") {
        // 存储原始 HTML（如果尚未存储）
        if (!tdJapanese.dataset.originalHtml) {
          tdJapanese.dataset.originalHtml = tdJapanese.innerHTML;
        }
        if (!tdChinese.dataset.originalHtml) {
          tdChinese.dataset.originalHtml = tdChinese.innerHTML;
        }

        // 使用存储的原始 HTML 进行合并
        const japaneseHTML = tdJapanese.dataset.originalHtml;
        let chineseHTML = tdChinese.dataset.originalHtml;

        // 移除中文翻译末尾的句号
        if (typeof chineseHTML === "string") {
          chineseHTML = chineseHTML.trim().replace(/。$/, "");
        }

        // 将原句和翻译都包裹在 span 中
        tdJapanese.innerHTML = `<span class="original-sentence">${japaneseHTML}</span> <span class="translation">${chineseHTML}</span>`;
        tdChinese.classList.add("cell-collapsed");
        // 添加合并状态的 class
        tdJapanese.classList.add("merged-example-cell");
        tdChinese.classList.remove("merged-example-cell"); // 确保中文单元格没有这个 class
      } else {
        // mode === 'split'
        // 恢复原始 HTML
        if (tdJapanese.dataset.originalHtml) {
          tdJapanese.innerHTML = tdJapanese.dataset.originalHtml;
        }
        // 恢复中文单元格的内容和显示
        if (tdChinese.dataset.originalHtml) {
          tdChinese.innerHTML = tdChinese.dataset.originalHtml;
        }
        tdChinese.classList.remove("cell-collapsed");
        // 移除合并状态的 class
        tdJapanese.classList.remove("merged-example-cell");
      }
    }
  });
  // --- 重要更新: 不再直接在 table 上标记 viewMode, 而是在其包装器上标记 ---
  // 获取或查找 table 的特定包装器，例如 table.closest('.table-layout-wrapper')
  const wrapper = table.closest(".table-layout-wrapper");
  if (wrapper) {
    wrapper.dataset.viewMode = mode;
  } else {
    console.warn("Table does not have a .table-layout-wrapper parent.");
  }
}

// --- 新增: 应用全局视图模式到所有表格 ---
function applyGlobalExampleView(mode) {
  const contentArea = document.getElementById("content-area");
  const tables = contentArea.querySelectorAll("table");
  tables.forEach((table) => {
    // 仅对包含日文和中文例句的表格应用切换逻辑
    // 可以通过检查表头或特定类名来增加判断的鲁棒性
    const headerCells = table.querySelectorAll("thead th");
    if (headerCells.length > 4) {
      // 简单检查列数
      setTableViewMode(table, mode);
    }
  });

  // 更新全局状态和按钮文本
  globalExampleViewMode = mode;
  const toggleButton = document.getElementById("global-view-toggle");
  if (toggleButton) {
    toggleButton.textContent = mode === "merged" ? "分开例句" : "合并例句";
  }
}

// --- 新增: 应用全局标题布局模式到所有表格 ---
function applyGlobalCaptionLayout(mode) {
  const contentArea = document.getElementById("content-area");
  const tableWrappers = contentArea.querySelectorAll(".table-layout-wrapper");

  tableWrappers.forEach((wrapper) => {
    if (mode === "vertical") {
      wrapper.classList.add("caption-vertical");
    } else {
      wrapper.classList.remove("caption-vertical");
    }
  });

  // 更新全局状态和按钮文本
  globalCaptionLayoutMode = mode;
  const toggleCaptionButton = document.getElementById("toggle-caption-layout");
  if (toggleCaptionButton) {
    toggleCaptionButton.textContent = mode === "vertical" ? "水平标题" : "垂直标题";
  }
}

function copyTableColumns(captionId) {
  // --- 修改: 从新的垂直容器或原始 caption 获取标题 ---
  // 首先尝试从垂直容器获取（如果布局是垂直）
  const verticalCaptionContainer = document.querySelector(`.table-layout-wrapper[data-caption-id="${CSS.escape(captionId)}"] .vertical-caption-container .caption-text`);
  let captionTitleRaw;
  if (verticalCaptionContainer && window.getComputedStyle(verticalCaptionContainer.parentElement).display !== "none") {
    captionTitleRaw = verticalCaptionContainer.textContent.trim() || "未知标题";
  } else {
    // 否则，回退到原始 caption （可能已隐藏）
    const captionElement = document.getElementById(captionId);
    if (captionElement) {
      captionTitleRaw = captionElement.firstChild?.textContent?.trim() || "未知标题";
    } else {
      console.error("找不到 Caption 元素或其替代品: " + captionId);
      return;
    }
  }

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

        // --- 新增: 查找表格并创建包装器和垂直标题容器 ---
        const tableElement = itemContainer.querySelector("table");
        if (tableElement) {
          const captionElement = tableElement.querySelector(`caption#${CSS.escape(result.item.id)}`);
          if (captionElement) {
            const captionText = captionElement.firstChild?.textContent?.trim() || "";
            const pageInfo = result.item.page; // Get page from item
            const originalCaptionId = result.item.id; // Store original ID

            // 1. 创建页码/复制按钮 Span
            const pageSpan = document.createElement("span");
            pageSpan.textContent = ` P${pageInfo}`;
            pageSpan.classList.add("page-info-span");
            pageSpan.style.color = "var(--base-text-secondary-color, #888888)";
            pageSpan.style.fontSize = "0.9rem";
            pageSpan.style.cursor = "pointer";
            pageSpan.style.fontWeight = "normal";
            pageSpan.onclick = (e) => {
              e.stopPropagation();
              copyTableColumns(originalCaptionId); // Use original item.id here
            };

            // 2. 创建垂直标题容器
            const verticalContainer = document.createElement("div");
            verticalContainer.classList.add("vertical-caption-container");

            // --- 修改: 处理括号旋转和数字组合 ---
            // 1. 处理括号
            let processedCaptionHTML = captionText.replace(/\(/g, '<span class="rotate-glyph">(</span>').replace(/\)/g, '<span class="rotate-glyph">)</span>');
            // 2. 处理连续数字（例如 "第10回" 中的 "10"）
            processedCaptionHTML = processedCaptionHTML.replace(/(\d{2,})/g, '<span class="combine-digits">$1</span>');

            const captionTextDiv = document.createElement("div");
            captionTextDiv.classList.add("caption-text");
            captionTextDiv.innerHTML = processedCaptionHTML; // 使用处理后的 HTML
            // --- 修改结束 ---

            verticalContainer.appendChild(captionTextDiv);
            verticalContainer.appendChild(pageSpan); // Add page span to vertical container

            // 3. 创建外部包装器
            const wrapper = document.createElement("div");
            wrapper.classList.add("table-layout-wrapper");
            // 将原始 caption ID 存储在 wrapper 上，以便 copyTableColumns 查找
            wrapper.dataset.captionId = originalCaptionId;

            // 4. DOM 操作：将 table 移入 wrapper，并将 verticalContainer 和 wrapper 插入
            itemContainer.insertBefore(wrapper, tableElement);
            wrapper.appendChild(verticalContainer); // Add vertical container first
            wrapper.appendChild(tableElement); // Then add table

            // 5. 处理原始 Caption：可以选择隐藏或移除，这里先隐藏
            captionElement.style.display = "none"; // Initially hide original caption via style
            // 如果选择移除： captionElement.remove();

            // 6. (可选) 将 PageSpan 移到垂直容器后，从原始 Caption 移除 (如果之前添加过)
            // captionElement.querySelector('.page-info-span')?.remove();
            // 注意：由于 pageSpan 是新创建并直接加入 verticalContainer 的，
            // 原始 caption 里不应该有它，所以不需要移除。
            // 如果之前的代码确实在 captionElement.appendChild(pageSpan) 了，则需要下面这行：
            // if (captionElement.contains(pageSpan)) { captionElement.removeChild(pageSpan); }
          } else {
            console.warn(`在表格中找不到 Caption: #${CSS.escape(result.item.id)}`);
          }
        } else {
          // 如果 itemContainer 中没有 table，可能需要处理这种情况
          // console.log(`Item container #${result.item.id} does not contain a table.`);
        }
        // --- 新增结束 ---
      } else {
        console.error(`无法找到项目容器: #container-${result.item.id}`);
      }
    });
    // --- 修改结束 ---

    // --- 新增: 内容加载并插入DOM后，应用当前的全局视图模式 和 标题布局模式 ---
    applyGlobalExampleView(globalExampleViewMode);
    applyGlobalCaptionLayout(globalCaptionLayoutMode); // 应用当前标题布局

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

  // --- 新增: 为全局切换按钮添加事件监听器 ---
  const globalToggleButton = document.getElementById("global-view-toggle");
  if (globalToggleButton) {
    globalToggleButton.addEventListener("click", () => {
      const nextMode = globalExampleViewMode === "split" ? "merged" : "split";
      applyGlobalExampleView(nextMode);
    });
  }

  // --- 新增: 为标题布局切换按钮添加事件监听器 ---
  const captionToggleButton = document.getElementById("toggle-caption-layout");
  if (captionToggleButton) {
    captionToggleButton.addEventListener("click", () => {
      const nextLayoutMode = globalCaptionLayoutMode === "horizontal" ? "vertical" : "horizontal";
      applyGlobalCaptionLayout(nextLayoutMode);
    });
  }

  // --- 新增结束 ---
});
