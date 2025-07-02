// 旅行语录数据
const travelQuotes = [
    {
        quote: "旅行不是为了到达目的地，而是为了享受沿途的风景。",
        author: "佚名"
    },
    {
        quote: "世界是一本书，不旅行的人只读了其中一页。",
        author: "圣奥古斯丁"
    },
    {
        quote: "旅行是唯一让你付出更多却变得更富有的事情。",
        author: "佚名"
    },
    {
        quote: "生活不是等待暴风雨过去，而是学会在雨中跳舞。",
        author: "佚名"
    },
    {
        quote: "旅行教会你最大的宽容，让你明白不同的人有不同的生活方式。",
        author: "佚名"
    },
    {
        quote: "旅行的意义在于找到自己，而非浏览他人。",
        author: "佚名"
    },
    {
        quote: "不要只计划，要出发。一次旅行可能会改变你的一生。",
        author: "佚名"
    }
];

// 表情包
const emojis = ["✈️", "🌍", "🗺️", "🏝️", "🏔️", "🌆", "🏕️", "🛫", "🛬", "🧳", "📸", "🌄", "🌅", "🌇", "🏞️", "🏖️", "🏜️", "🏝️", "🗼", "🗽", "⛺", "🛤️", "🚂", "🚢", "🚁"];


// 当前编辑的旅行ID
let currentTravelId = null;
// 存储所有旅行数据
let travels = JSON.parse(localStorage.getItem('travels')) || [];
// 存储上传的图片
let uploadedImages = [];
// 当前选择的音乐
let currentMusic = null;
// 音频对象
let audio = null;
// 当前用户昵称
let userNickname = localStorage.getItem('nickname')) || '我的';
// 打字效果相关变量
let typingText = '';
let typingIndex = 0;
let isDeleting = false;
let typingTimeout;
// 图片轮播计时器
let carouselIntervals = {};

// DOM元素
const travelCardsContainer = document.getElementById('travelCards');
const addTravelBtn = document.getElementById('addTravel');
const travelModal = document.getElementById('travelModal');
const closeModalBtn = document.getElementById('closeModal');
const travelForm = document.getElementById('travelForm');
const modalTitle = document.getElementById('modalTitle');
const imageUpload = document.getElementById('imageUpload');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const musicToggle = document.getElementById('musicToggle');
const addMusicBtn = document.getElementById('addMusicBtn');
const musicModal = document.getElementById('musicModal');
const closeMusicModalBtn = document.getElementById('closeMusicModal');
const musicSearch = document.getElementById('musicSearch');
const searchMusicBtn = document.getElementById('searchMusicBtn');
const musicResults = document.getElementById('musicResults');
const musicTitle = document.getElementById('musicTitle');
const musicArtist = document.getElementById('musicArtist');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettingsBtn = document.getElementById('closeSettings');
const themeOptions = document.querySelectorAll('.theme-option');
const bgImageUpload = document.getElementById('bgImageUpload');
const bgFileInput = document.getElementById('bgFileInput');
const resetBgBtn = document.getElementById('resetBgBtn');
const travelQuote = document.getElementById('travelQuote');
const quoteAuthor = document.getElementById('quoteAuthor');
const refreshQuote = document.getElementById('refreshQuote');
const logoText = document.getElementById('logoText');
const nicknameInput = document.getElementById('nicknameInput');
const saveNicknameBtn = document.getElementById('saveNicknameBtn');
const travelDetailView = document.getElementById('travelDetailView');
const closeDetailView = document.getElementById('closeDetailView');
const detailLocation = document.getElementById('detailLocation');
const detailDate = document.getElementById('detailDate');
const travelDetailContent = document.getElementById('travelDetailContent');

// 初始化页面
function initPage() {
    renderTravelCards();
    displayRandomQuote();
    loadTheme();
    updateUserLogo();
    
    // 检查是否有背景图片
    const bgImage = localStorage.getItem('backgroundImage');
    if (bgImage) {
        document.body.style.backgroundImage = `url(${bgImage})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundPosition = 'center';
    }
}

// 更新用户logo
function updateUserLogo() {
    logoText.textContent = `${userNickname}的旅行日记`;
}

// 显示随机语录（带打字效果）
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * travelQuotes.length);
    const randomQuote = travelQuotes[randomIndex];
    
    typingText = randomQuote.quote;

     // 随机添加表情
    const emoji1 = emojis[Math.floor(Math.random() * emojis.length)];
    const emoji2 = emojis[Math.floor(Math.random() * emojis.length)];
    typingText = `${emoji1} ${randomQuote.quote} ${emoji2}`;
    
    // 更新作者
    quoteAuthor.textContent = `— ${randomQuote.author}`;
    
    // 开始打字效果
    typingIndex = 0;
    isDeleting = false;
    typeQuote();
}

// 打字效果
function typeQuote() {
    clearTimeout(typingTimeout);
    
    const currentText = typingText.substring(0, typingIndex);
    travelQuote.innerHTML = currentText + `<span class="typing-cursor"></span>`;
    
    if (!isDeleting && typingIndex === typingText.length) {
        // 完成打字，等待2秒后开始删除
        isDeleting = true;
        typingTimeout = setTimeout(typeQuote, 2000);
        return;
    } else if (isDeleting && typingIndex === 0) {
        // 完成删除，显示新语录
        displayRandomQuote();
        return;
    }
    
    if (isDeleting) {
        typingIndex--;
    } else {
        typingIndex++;
    }
    
    const typingSpeed = isDeleting ? 50 : 100 + Math.random() * 50;
    typingTimeout = setTimeout(typeQuote, typingSpeed);
}

// 渲染旅行卡片
function renderTravelCards() {
    // 清空容器，保留添加按钮
    travelCardsContainer.innerHTML = '';
    
    // 清空所有轮播计时器
    Object.values(carouselIntervals).forEach(interval => clearInterval(interval));
    carouselIntervals = {};
    
    // 添加已有的旅行卡片
    travels.forEach(travel => {
        const travelCard = document.createElement('div');
        travelCard.className = 'travel-card';
        travelCard.innerHTML = `
            <div class="card-image-container" id="carousel-${travel.id}">
                <!-- 图片会动态添加 -->
            </div>
            <div class="card-content">
                <div class="card-location">${travel.location}</div>
                <div class="card-date">${formatDate(travel.date)}</div>
                <div class="view-travel-btn">查看旅行详情</div>
            </div>
        `;
        
        // 添加图片轮播
        const carouselContainer = travelCard.querySelector(`#carousel-${travel.id}`);
        setupCarousel(carouselContainer, travel.images, travel.id);
        
        // 添加点击事件编辑旅行
        travelCard.addEventListener('click', (e) => {
            // 如果点击的是查看详情按钮，不触发编辑
            if (!e.target.classList.contains('view-travel-btn')) {
                editTravel(travel.id);
            }
        });
        
        // 添加查看详情按钮事件
        const viewBtn = travelCard.querySelector('.view-travel-btn');
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showTravelDetail(travel);
        });
        
        travelCardsContainer.appendChild(travelCard);
    });
    
    // 最后添加"添加新旅行"卡片
    travelCardsContainer.appendChild(addTravelBtn);
}

// 设置图片轮播
function setupCarousel(container, images, travelId) {
    // 清空容器
    container.innerHTML = '';
    
    // 添加所有图片
    images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image;
        img.className = 'card-image';
        img.dataset.index = index;
        if (index === 0) img.classList.add('active');
        container.appendChild(img);
    });
    
    // 添加轮播指示器
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    images.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.dataset.index = index;
        indicators.appendChild(indicator);
    });
    container.appendChild(indicators);
    
    // 设置轮播
    let currentIndex = 0;
    const imageElements = container.querySelectorAll('.card-image');
    const indicatorElements = container.querySelectorAll('.indicator');
    
    function showImage(index) {
        // 隐藏所有图片
        imageElements.forEach(img => img.classList.remove('active'));
        indicatorElements.forEach(ind => ind.classList.remove('active'));
        
        // 显示当前图片
        imageElements[index].classList.add('active');
        indicatorElements[index].classList.add('active');
        currentIndex = index;
    }
    
    function nextImage() {
        const nextIndex = (currentIndex + 1) % images.length;
        showImage(nextIndex);
    }
    
    // 启动轮播
    carouselIntervals[travelId] = setInterval(nextImage, 3000);
    
    // 点击指示器切换图片
    indicatorElements.forEach(indicator => {
        indicator.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            showImage(index);
            // 重置轮播计时器
            clearInterval(carouselIntervals[travelId]);
            carouselIntervals[travelId] = setInterval(nextImage, 3000);
        });
    });
}

// 修改显示旅行详情的函数
function showTravelDetail(travel) {
    detailLocation.textContent = travel.location;
    detailDate.textContent = formatDate(travel.date);
    
    // 清空内容
    travelDetailContent.innerHTML = '';
    
    // 添加所有图片
    travel.images.forEach((image) => {
        const img = document.createElement('img');
        img.src = image;
        img.className = 'travel-detail-image';
        travelDetailContent.appendChild(img);
    });
    
    // 添加旅行描述（如果有）
    if (travel.description) {
        const desc = document.createElement('div');
        desc.className = 'travel-detail-description';
        desc.style.marginTop = '30px';
        desc.style.padding = '20px';
        desc.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        desc.style.borderRadius = '10px';
        desc.textContent = travel.description;
        travelDetailContent.appendChild(desc);
    }
    
    // 显示详情视图
    travelDetailView.style.display = 'block';
}

// 关闭旅行详情
closeDetailView.addEventListener('click', () => {
    travelDetailView.style.display = 'none';
});

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

// 添加新旅行
addTravelBtn.addEventListener('click', () => {
    currentTravelId = Date.now().toString(); // 使用时间戳作为唯一ID
    modalTitle.textContent = '添加新旅行';
    uploadedImages = [];
    currentMusic = null;
    imagePreview.innerHTML = '';
    musicTitle.textContent = '未添加音乐';
    musicArtist.textContent = '点击右侧按钮添加';
    travelForm.reset();
    travelModal.style.display = 'flex';
});

// 编辑旅行
function editTravel(travelId) {
    const travel = travels.find(t => t.id === travelId);
    if (!travel) return;
    
    currentTravelId = travelId;
    modalTitle.textContent = '编辑旅行';
    uploadedImages = [...travel.images];
    currentMusic = travel.music || null;
    
    // 填充表单
    document.getElementById('travelLocation').value = travel.location;
    document.getElementById('travelDate').value = travel.date;
    document.getElementById('travelDescription').value = travel.description || '';
    
    // 显示图片预览
    imagePreview.innerHTML = '';
    uploadedImages.forEach((image, index) => {
        createImagePreview(image, index);
    });
    
    // 显示音乐信息
    if (currentMusic) {
        musicTitle.textContent = currentMusic.title;
        musicArtist.textContent = currentMusic.artist;
    } else {
        musicTitle.textContent = '未添加音乐';
        musicArtist.textContent = '点击右侧按钮添加';
    }
    
    travelModal.style.display = 'flex';
}

// 关闭模态框
closeModalBtn.addEventListener('click', () => {
    travelModal.style.display = 'none';
});

// 点击模态框外部关闭
window.addEventListener('click', (e) => {
    if (e.target === travelModal) {
        travelModal.style.display = 'none';
    }
    if (e.target === musicModal) {
        musicModal.style.display = 'none';
    }
    if (e.target === travelDetailView) {
        travelDetailView.style.display = 'none';
    }
});

// 图片上传处理
imageUpload.addEventListener('click', () => {
    fileInput.click();
});

// 拖放上传
imageUpload.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageUpload.style.borderColor = 'var(--primary-color)';
    imageUpload.style.backgroundColor = 'rgba(255, 154, 118, 0.1)';
});

imageUpload.addEventListener('dragleave', () => {
    imageUpload.style.borderColor = 'var(--primary-color)';
    imageUpload.style.backgroundColor = 'rgba(255, 154, 118, 0.05)';
});

imageUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    imageUpload.style.borderColor = 'var(--primary-color)';
    imageUpload.style.backgroundColor = 'rgba(255, 154, 118, 0.05)';
    
    if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        handleFiles(fileInput.files);
    }
});

// 处理上传的文件
function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.match('image.*')) continue;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImages.push(e.target.result);
            createImagePreview(e.target.result, uploadedImages.length - 1);
        };
        reader.readAsDataURL(file);
    }
}

// 创建图片预览
function createImagePreview(imageSrc, index) {
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item fade-in';
    previewItem.innerHTML = `
        <img src="${imageSrc}" class="preview-image">
        <div class="preview-actions">
            <button class="preview-btn edit-btn" data-index="${index}"><i class="fas fa-edit"></i></button>
            <button class="preview-btn delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    imagePreview.appendChild(previewItem);
    
    // 添加删除按钮事件
    const deleteBtn = previewItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        uploadedImages.splice(index, 1);
        renderImagePreviews();
    });
}

// 重新渲染图片预览
function renderImagePreviews() {
    imagePreview.innerHTML = '';
    uploadedImages.forEach((image, index) => {
        createImagePreview(image, index);
    });
}

// 添加/编辑音乐
addMusicBtn.addEventListener('click', () => {
    musicModal.style.display = 'flex';
});

closeMusicModalBtn.addEventListener('click', () => {
    musicModal.style.display = 'none';
});

// 搜索音乐 (这里只是模拟，实际项目中可以接入网易云API)
searchMusicBtn.addEventListener('click', () => {
    const query = musicSearch.value.trim();
    if (!query) return;
    
    // 模拟搜索结果
    const mockResults = [
        {
            id: '1',
            title: '旅行的意义',
            artist: '陈绮贞',
            url: 'https://music.163.com/song/media/outer/url?id=386538.mp3'
        },
        {
            id: '2',
            title: '去大理',
            artist: '郝云',
            url: 'https://music.163.com/song/media/outer/url?id=27902933.mp3'
        },
        {
            id: '3',
            title: '成都',
            artist: '赵雷',
            url: 'https://music.163.com/song/media/outer/url?id=436514312.mp3'
        },
        {
            id: '4',
            title: '蓝莲花',
            artist: '许巍',
            url: 'https://music.163.com/song/media/outer/url?id=167844.mp3'
        },
        {
            id: '5',
            title: '平凡之路',
            artist: '朴树',
            url: 'https://music.163.com/song/media/outer/url?id=28815250.mp3'
        }
    ].filter(song => 
        song.title.includes(query) || song.artist.includes(query)
    );
    
    displayMusicResults(mockResults);
});

// 显示音乐搜索结果
function displayMusicResults(results) {
    musicResults.innerHTML = '';
    
    if (results.length === 0) {
        musicResults.innerHTML = '<p>没有找到相关音乐</p>';
        return;
    }
    
    results.forEach(song => {
        const songItem = document.createElement('div');
        songItem.className = 'music-player';
        songItem.style.marginBottom = '10px';
        songItem.style.cursor = 'pointer';
        songItem.innerHTML = `
            <i class="fas fa-music music-icon"></i>
            <div class="music-info">
                <div class="music-title">${song.title}</div>
                <div class="music-artist">${song.artist}</div>
            </div>
        `;
        
        songItem.addEventListener('click', () => {
            currentMusic = song;
            musicTitle.textContent = song.title;
            musicArtist.textContent = song.artist;
            musicModal.style.display = 'none';
            
            // 如果正在播放，停止播放
            if (audio) {
                audio.pause();
                audio = null;
                musicToggle.className = 'fas fa-music music-icon';
            }
        });
        
        musicResults.appendChild(songItem);
    });
}

// 切换音乐播放状态
musicToggle.addEventListener('click', () => {
    if (!currentMusic) return;
    
    if (audio) {
        // 正在播放，停止
        audio.pause();
        audio = null;
        musicToggle.className = 'fas fa-music music-icon';
    } else {
        // 开始播放
        audio = new Audio(currentMusic.url);
        audio.play();
        musicToggle.className = 'fas fa-pause music-icon';
        
        audio.addEventListener('ended', () => {
            musicToggle.className = 'fas fa-music music-icon';
            audio = null;
        });
    }
});

// 保存旅行
travelForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const location = document.getElementById('travelLocation').value;
    const date = document.getElementById('travelDate').value;
    const description = document.getElementById('travelDescription').value;
    
    if (!location || !date || uploadedImages.length === 0) {
        alert('请填写完整信息并至少上传一张图片');
        return;
    }
    
    const travelData = {
        id: currentTravelId,
        location,
        date,
        description,
        images: uploadedImages,
        music: currentMusic || null
    };
    
    // 检查是添加还是更新
    const existingIndex = travels.findIndex(t => t.id === currentTravelId);
    if (existingIndex >= 0) {
        travels[existingIndex] = travelData;
    } else {
        travels.push(travelData);
    }
    
    // 保存到本地存储
    localStorage.setItem('travels', JSON.stringify(travels));
    
    // 重新渲染卡片
    renderTravelCards();
    
    // 关闭模态框
    travelModal.style.display = 'none';
});

// 设置面板
settingsBtn.addEventListener('click', () => {
    settingsPanel.style.display = 'block';
    // 设置当前昵称到输入框
    nicknameInput.value = userNickname;
    // 添加旋转效果
    settingsBtn.classList.add('rotate');
    setTimeout(() => {
        settingsBtn.classList.remove('rotate');
    }, 300);
});

closeSettingsBtn.addEventListener('click', () => {
    settingsPanel.style.display = 'none';
});

// 保存昵称
saveNicknameBtn.addEventListener('click', () => {
    const newNickname = nicknameInput.value.trim();
    if (newNickname) {
        userNickname = newNickname;
        localStorage.setItem('nickname', userNickname);
        updateUserLogo();
        settingsPanel.style.display = 'none';
    }
});

// 主题选择
themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        // 移除所有选中状态
        themeOptions.forEach(opt => opt.classList.remove('selected'));
        // 添加当前选中状态
        option.classList.add('selected');
        
        // 应用主题
        const theme = option.dataset.theme;
        applyTheme(theme);
        
        // 保存主题
        localStorage.setItem('theme', theme);
    });
});

// 应用主题
function applyTheme(theme) {
    let primaryColor, secondaryColor, bgColor, textColor, cardBg;
    
    switch (theme) {
        case 'orange':
            primaryColor = '#FFB347';
            secondaryColor = '#FFD166';
            bgColor = '#FFF5E6';
            textColor = '#5E5346';
            cardBg = '#FFFFFF';
            break;
        case 'sunshine':
            primaryColor = '#FFD166';
            secondaryColor = '#FFEE93';
            bgColor = '#FFFCE6';
            textColor = '#5E5346';
            cardBg = '#FFFFFF';
            break;
        case 'apricot':
            primaryColor = '#F4A261';
            secondaryColor = '#E9C46A';
            bgColor = '#FDF0E6';
            textColor = '#5E5346';
            cardBg = '#FFFFFF';
            break;
        case 'honey':
            primaryColor = '#E9C46A';
            secondaryColor = '#F4A261';
            bgColor = '#FDF8E6';
            textColor = '#5E5346';
            cardBg = '#FFFFFF';
            break;
        case 'berry':
            primaryColor = '#EF476F';
            secondaryColor = '#FF9A76';
            bgColor = '#FFEEF0';
            textColor = '#5E5346';
            cardBg = '#FFFFFF';
            break;
        default: // peach
            primaryColor = '#FF9A76';
            secondaryColor = '#FFD166';
            bgColor = '#FFF5F0';
            textColor = '#5E5346';
            cardBg = '#FFFFFF';
    }
    
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    document.documentElement.style.setProperty('--bg-color', bgColor);
    document.documentElement.style.setProperty('--text-color', textColor);
    document.documentElement.style.setProperty('--card-bg', cardBg);
}

// 加载保存的主题
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'peach';
    const themeOption = document.querySelector(`.theme-option[data-theme="${savedTheme}"]`);
    
    if (themeOption) {
        themeOptions.forEach(opt => opt.classList.remove('selected'));
        themeOption.classList.add('selected');
        applyTheme(savedTheme);
    }
}

// 背景图片上传
bgImageUpload.addEventListener('click', () => {
    bgFileInput.click();
});

bgFileInput.addEventListener('change', () => {
    if (bgFileInput.files.length > 0) {
        const file = bgFileInput.files[0];
        if (!file.type.match('image.*')) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            document.body.style.backgroundImage = `url(${imageUrl})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundPosition = 'center';
            
            // 保存背景图片
            localStorage.setItem('backgroundImage', imageUrl);
        };
        reader.readAsDataURL(file);
    }
});

// 重置背景
resetBgBtn.addEventListener('click', () => {
    document.body.style.backgroundImage = '';
    localStorage.removeItem('backgroundImage');
});

// 刷新语录
refreshQuote.addEventListener('click', displayRandomQuote);

// 初始化页面
document.addEventListener('DOMContentLoaded', initPage);
