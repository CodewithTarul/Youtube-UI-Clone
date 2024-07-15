const videoCardContainer = document.querySelector(".videowrapper");
const api_key = "Secret Api Key";
const video_http = "https://www.googleapis.com/youtube/v3/videos?";
const channel_http = "https://www.googleapis.com/youtube/v3/channels?";

// Fetch the most popular videos
const fetchPopularVideos = async () => {
    try {
        const response = await fetch(video_http + new URLSearchParams({
            part: "snippet,contentDetails,statistics,player",
            chart: "mostPopular",
            maxResults: 40,
            regionCode: "IN",
            key: api_key,
        }));
        const data = await response.json();
        data.items.forEach(item => getChannelIcon(item));
    } catch (err) {
        console.error(err);
    }
};

// Fetch the channel icon
const getChannelIcon = async (videoData) => {
    try {
        const response = await fetch(channel_http + new URLSearchParams({
            key: api_key,
            part: "snippet",
            id: videoData.snippet.channelId,
        }));
        const data = await response.json();
        videoData.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
        makeVideoCard(videoData);
    } catch (err) {
        console.error(err);
    }
};

// Create the video card
const makeVideoCard = (data) => {
    const videoCard = document.createElement("div");
    videoCard.classList.add("video");

    // Format views and upload time
    const views = formatViews(data.statistics.viewCount);
    const uploadTime = formatUploadTime(data.snippet.publishedAt);

    videoCard.innerHTML = `
        <div class="videocontent">
            <img src="${data.snippet.thumbnails.high.url}" alt="Video Thumbnail" class="thumbnail">
            <div class="videodetails">
                <div class="channellogo">
                    <img src="${data.channelThumbnail}" alt="Channel Icon" class="channel-icon">
                </div>
                <div class="detail">
                    <h3 class="title">${data.snippet.title}</h3>
                    <div class="channelname">${data.snippet.channelTitle}</div>
                    <div class="stats">
                        <div class="views">${views} views</div>
                        <div class="upload-time">${uploadTime} ago</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    videoCardContainer.appendChild(videoCard);
};

// Format views in (k views)
const formatViews = (viewCount) => {
    const numViews = parseInt(viewCount, 10);
    if (numViews >= 1e6) {
        return (numViews / 1e5).toFixed(0) + 'M'; // Millions
    } else if (numViews >= 1e3) {
        return (numViews / 1e2).toFixed(0) + 'K'; // Thousands
    }
    return numViews; // Less than 1K
};

// Format upload time
const formatUploadTime = (publishedAt) => {
    const now = new Date();
    const uploadDate = new Date(publishedAt);
    const seconds = Math.floor((now - uploadDate) / 1000);

    if (seconds < 60) return `${seconds} seconds `;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours `;
    const days = Math.floor(hours / 24);
    return `${days} days`;
};

// Initialize fetching process
fetchPopularVideos();
