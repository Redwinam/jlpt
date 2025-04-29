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
