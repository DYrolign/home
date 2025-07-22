// 获取DOM元素
const container = document.getElementById('container');
const bgLayer = document.getElementById('background-layer');
const mgLayer = document.getElementById('midground-layer');
const fgLayer = document.getElementById('foreground-layer');

// 视差系数 (背景移动慢，前景移动快)
const parallaxFactors = {
    background: 0.3,
    midground: 0.8,
    foreground: 1.0
};

// 初始位置和状态
let scrollX = 0;
let scrollY = 0;
let targetX = 0;
let targetY = 0;
let isActive = true;

// 计算移动边界（确保不会移出房间）
const maxScrollX = bgLayer.offsetWidth - container.offsetWidth;
const maxScrollY = bgLayer.offsetHeight - container.offsetHeight;


// 更新所有图层位置
function updateLayers() {
    // 应用视差效果
    bgLayer.style.transform = `translate(${-scrollX * parallaxFactors.background}px, ${-scrollY * parallaxFactors.background}px)`;
    mgLayer.style.transform = `translate(${-scrollX * parallaxFactors.midground * 6}px, ${-scrollY * parallaxFactors.midground}px)`;
    fgLayer.style.transform = `translate(${-scrollX * parallaxFactors.foreground * 6}px, ${-scrollY * parallaxFactors.foreground}px)`;
}

// 鼠标移动事件处理
container.addEventListener('mousemove', (e) => {
    if (!isActive) return;

    // 计算鼠标在容器内的相对位置（0到1）
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 计算目标滚动位置（鼠标靠近边缘时移动更多）
    targetX = (x / container.offsetWidth) * maxScrollX;
    targetY = (y / container.offsetHeight) * maxScrollY;
});

// 平滑动画函数
function animate() {
    // 使用缓动效果平滑过渡
    scrollX += (targetX - scrollX) * 0.1;
    scrollY += (targetY - scrollY) * 0.1;

    // 边界约束
    scrollX = Math.max(0, Math.min(scrollX, maxScrollX));
    scrollY = Math.max(0, Math.min(scrollY, maxScrollY));

    updateLayers();
    requestAnimationFrame(animate);
}

// 窗口激活状态检测
window.addEventListener('focus', () => {
    isActive = true;
    customCursor.style.display = 'block';
});

window.addEventListener('blur', () => {
    isActive = false;
});

// 鼠标离开容器时逐渐回到中心
container.addEventListener('mouseleave', () => {
    targetX = maxScrollX / 2;
    targetY = maxScrollY / 2;
});

// 初始化
targetX = maxScrollX / 2;
targetY = maxScrollY / 2;
animate();

// 响应窗口大小变化
window.addEventListener('resize', () => {
    // 重新计算边界
    maxScrollX = bgLayer.offsetWidth - container.offsetWidth;
    maxScrollY = bgLayer.offsetHeight - container.offsetHeight;

    // 约束当前位置
    scrollX = Math.max(0, Math.min(scrollX, maxScrollX));
    scrollY = Math.max(0, Math.min(scrollY, maxScrollY));
    targetX = Math.max(0, Math.min(targetX, maxScrollX));
    targetY = Math.max(0, Math.min(targetY, maxScrollY));

    updateLayers();
});