function copyTableColumns(captionId) {
  const captionElement = document.getElementById(captionId);
  if (!captionElement) {
    console.error("找不到 Caption 元素: " + captionId);
    return;
  }

  const tableElement = captionElement.parentElement; // Caption 是 Table 的直接子元素
  if (!tableElement || tableElement.tagName !== "TABLE") {
    console.error("找不到父级 Table 元素");
    return;
  }

  const tbody = tableElement.querySelector("tbody");
  if (!tbody) {
    console.error("找不到 tbody");
    return;
  }

  let textToCopy = "";
  const rows = tbody.querySelectorAll("tr");

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    // 确保行有足够的单元格 (至少4个: 序号, 单词, 读音, 日文例句)
    if (cells.length >= 4) {
      const cell3Text = cells[2].textContent.trim(); // 第3列 (索引 2)
      let cell4Text = cells[3].textContent.trim(); // 第4列 (索引 3)
      // 去除例句中的 (自) 和 (他) 标记
      cell4Text = cell4Text.replace(/（[自他]）[。]?/g, "").trim();

      // 新增：如果日文例句非空且不以句号结尾，则添加句号
      if (cell4Text && !cell4Text.endsWith("。")) {
        cell4Text += "。";
      }

      // 如果两列都有内容才复制
      if (cell3Text || cell4Text) {
        textToCopy += cell3Text + "\n" + cell4Text + "\n\n"; // 列之间换行，每对之间加两个换行
      }
    } else {
      console.warn("行单元格数量不足:", row);
    }
  });

  // 移除末尾多余的换行符
  textToCopy = textToCopy.trim();

  if (textToCopy) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        // alert("已复制到剪贴板！");
        showNotification("已复制到剪贴板！"); // 使用新的通知函数
      })
      .catch((err) => {
        console.error("无法复制文本: ", err);
        alert("复制失败！请检查浏览器权限或控制台错误信息。"); // 失败提示暂时保留 alert
      });
  } else {
    alert("表格中没有可复制的内容。");
  }
}

// 新增：显示通知的函数
function showNotification(message) {
  // 创建通知元素
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
  notification.style.zIndex = "1000"; // 确保在顶层
  notification.style.opacity = "0"; // 初始透明
  notification.style.transition = "opacity 0.5s ease-in-out"; // 添加淡入淡出效果

  // 添加到页面
  document.body.appendChild(notification);

  // 淡入效果
  setTimeout(() => {
    notification.style.opacity = "1";
  }, 10); // 延迟一点点以确保过渡效果生效

  // 2秒后自动移除
  setTimeout(() => {
    notification.style.opacity = "0"; // 开始淡出
    // 在过渡结束后移除元素
    notification.addEventListener("transitionend", () => {
      notification.remove();
    });
  }, 2000); // 显示 2 秒
}

// --- 新增代码开始 ---

document.addEventListener("DOMContentLoaded", () => {
  const contentArea = document.getElementById("content-area");
  const tocList = document.querySelector("#toc ul");
  const topNav = document.querySelector(".top-nav ul");

  // 定义不同内容类型及其对应的 HTML 片段文件
  const contentSources = {
    "n1-kanji": {
      title: "N1级 汉字",
      fragments: [
        "N1 - 汉字/第1回　動詞Aレベル.html",
        "N1 - 汉字/第2回　動詞Aレベル.html",
        "N1 - 汉字/第3回　動詞Bレベル.html",
        "N1 - 汉字/第4回　動詞Bレベル.html",
        "N1 - 汉字/第5回　動詞Cレベル.html",
        "N1 - 汉字/第6回　動詞Cレベル.html",
        "N1 - 汉字/第7回　い形容詞.html",
        "N1 - 汉字/第8回　な形容詞　副詞・その他.html",
        "N1 - 汉字/第9回　名詞　(1) 道具.html",
        "N1 - 汉字/第9回　名詞　(2) 人・衣服.html",
        "N1 - 汉字/第9回　名詞　(3) 身体・感情.html",
        "N1 - 汉字/第10回　名詞　(4) 自然　(5) 植物・食物　(6) 建造物・形状.html",
        "N1 - 汉字/第11回　名詞　(7) 野生・生活　(8) 経済・生活　(9) 時・空間.html",
      ],
      // 可以为其他类型添加 H1/H2 结构
      structure: `
                <h1 id="新完全掌握日语能力考试 ==🟣N1级== ==🔴汉字==">新完全掌握日语能力考试 <mark class="highlighted purple">N1级</mark> <mark class="highlighted red">汉字</mark></h1>
                <h2 id="第1部　訓読み">第1部　訓読み</h2>
                <!-- 表格内容将插入这里 -->
            `,
    },
    // 'n1-grammar': {
    //     title: 'N1级 语法',
    //     fragments: ['grammar/part1.html', 'grammar/part2.html'],
    //      structure: `<h1>N1级 语法</h1><h2>第一章</h2>...`
    // },
    // ... 其他内容类型
  };

  // 生成目录
  function generateTOC() {
    tocList.innerHTML = ""; // 清空现有目录
    const captions = contentArea.querySelectorAll("caption[id]");
    if (captions.length === 0) {
      tocList.innerHTML = "<li>无目录项</li>";
      return;
    }
    captions.forEach((caption) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${caption.id}`;
      a.textContent = caption.textContent.trim() || caption.id;
      // 平滑滚动效果 (可选)
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const targetElement = document.getElementById(caption.id);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          // 更新地址栏 hash，但不触发页面跳转
          // history.pushState(null, null, `#${caption.id}`);
        }
      });
      li.appendChild(a);
      tocList.appendChild(li);
    });
  }

  // 加载内容
  async function loadContent(contentType) {
    if (!contentSources[contentType]) {
      contentArea.innerHTML = "<h1>错误：未定义的内容类型</h1>";
      tocList.innerHTML = "";
      return;
    }

    const source = contentSources[contentType];
    contentArea.innerHTML = '<h1><span class="loading-spinner"></span> 正在加载 ' + source.title + "...</h1>"; // 显示加载提示
    tocList.innerHTML = "<li>加载中...</li>";

    let contentHtml = source.structure || ""; // 使用定义的结构或空字符串
    const fragmentPromises = source.fragments.map(async (fragmentUrl) => {
      try {
        const response = await fetch(fragmentUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for ${fragmentUrl}`);
        }
        return await response.text();
      } catch (error) {
        console.error(`加载片段失败: ${fragmentUrl}`, error);
        return `<p style="color: red;">加载失败: ${fragmentUrl}</p>`; // 显示错误信息
      }
    });

    // 等待所有片段加载完成
    const fragmentContents = await Promise.all(fragmentPromises);

    // 将加载的片段内容拼接到结构中
    // 如果有特定插入点标记则用标记，否则直接追加
    const insertionPoint = "<!-- 表格内容将插入这里 -->";
    if (contentHtml.includes(insertionPoint)) {
      contentHtml = contentHtml.replace(insertionPoint, fragmentContents.join("\n"));
    } else {
      contentHtml += fragmentContents.join("\n");
    }

    contentArea.innerHTML = contentHtml; // 更新内容区域
    generateTOC(); // 生成目录
  }

  // 导航点击事件处理
  topNav.addEventListener("click", (e) => {
    if (e.target.tagName === "A" && e.target.dataset.contentType) {
      e.preventDefault();
      const contentType = e.target.dataset.contentType;

      // 更新 active 状态
      topNav.querySelectorAll("a").forEach((link) => link.classList.remove("active"));
      e.target.classList.add("active");

      loadContent(contentType);
    }
  });

  // 初始加载默认内容 (N1 汉字)
  const defaultContentType = "n1-kanji";
  const defaultNavLink = topNav.querySelector(`a[data-content-type="${defaultContentType}"]`);
  if (defaultNavLink) {
    defaultNavLink.classList.add("active");
    loadContent(defaultContentType);
  } else if (Object.keys(contentSources).length > 0) {
    // 如果默认的找不到，加载第一个可用的
    const firstContentType = Object.keys(contentSources)[0];
    const firstNavLink = topNav.querySelector(`a[data-content-type="${firstContentType}"]`);
    if (firstNavLink) firstNavLink.classList.add("active");
    loadContent(firstContentType);
  } else {
    contentArea.innerHTML = "<h1>没有可加载的内容</h1>";
    tocList.innerHTML = "";
  }
});

// --- 新增代码结束 ---
