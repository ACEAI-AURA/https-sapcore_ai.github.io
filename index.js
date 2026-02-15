<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SAPCORE - Sapphire AI Core Universe</title>
    
    <!-- 스타일 및 폰트 -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    
    <!-- React 및 라이브러리 로드 -->
    <script type="importmap">
    {
        "imports": {
            "react": "https://esm.sh/react@18.2.0",
            "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
            "lucide-react": "https://esm.sh/lucide-react@0.344.0"
        }
    }
    </script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <style>
        body { font-family: 'Noto Sans KR', sans-serif; background-color: #F8F9FA; -webkit-tap-highlight-color: transparent; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .fade-in { animation: fadeIn 0.3s ease-in-out; }
        .scale-in { animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        button:active { transform: scale(0.95); transition: transform 0.1s; }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel" data-type="module">
        import React, { useState, useEffect, useRef } from 'react';
        import { createRoot } from 'react-dom/client';
        import { 
            Compass, Layers, PlayCircle, BookOpen, UserCircle2, Flame, 
            MessageSquare, Gem, Plus, ArrowUpRight, TrendingUp, Star, 
            Heart, X, Send, Image as ImageIcon, Film, PenTool, LogOut, 
            Mail, Lock, User, Camera, UserPlus, UserCheck, Globe, 
            Scissors, Users, Search, Bell, Edit2, Check, Sparkles, Download,
            Award, Medal, Crown // 뱃지 관련 아이콘 추가
        } from 'lucide-react';

        // --- Firebase 설정 (CDN) ---
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
        import { getFirestore, collection, addDoc, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
        import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

        // Firebase 초기화
        let app, auth, db;
        const appId = 'sapcore-web-app';
        let isFirebaseAvailable = false;

        try {
            const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
            if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
                app = initializeApp(firebaseConfig);
                auth = getAuth(app);
                db = getFirestore(app);
                isFirebaseAvailable = true;
            }
        } catch (e) { 
            console.log("Local Mode: Firebase not connected"); 
            isFirebaseAvailable = false;
        }

        // --- 번역 데이터 ---
        const TRANSLATIONS = {
            ko: {
                login: '로그인', signup: '회원가입 완료', signupLink: '회원가입하기', loginLink: '로그인하기',
                noAccount: '아직 계정이 없으신가요?', hasAccount: '이미 계정이 있으신가요?',
                emailPlace: '이메일 (E-mail)', pwPlace: '비밀번호 (Password)', nickPlace: '닉네임 (Nickname)',
                loginFail: '정보를 입력해주세요.', emailDup: '이미 가입된 이메일입니다.',
                fillAll: '모든 항목을 입력해주세요.', welcome: '환영합니다', explore: '탐색', nodes: '노드',
                stories: '스토리', profile: '프로필', upload: '업로드', logout: '로그아웃', myUploads: '내 작품들',
                createTitle: '새 작품 만들기', uploadMoment: '사진 추가', uploadVideo: '썸네일 업로드',
                uploadWebtoon: '표지 업로드', momentTitle: '제목을 입력하세요', videoTitle: '영상 제목을 입력하세요',
                webtoonTitle: '웹툰 제목을 입력하세요', webtoonDesc: '웹툰의 줄거리 및 시놉시스를 입력하세요...',
                commentPlace: '댓글 달기...', follow: '팔로우', following: '팔로잉', loginProcessing: '로그인 중...', errorAuth: '오류 발생',
                noUploads: '아직 업로드한 작품이 없습니다.', chat: '채팅', groupChat: '단체 채팅', findGroup: '방 찾기',
                createGroup: '방 만들기', newMsg: '새 메시지', groupName: '방 이름 입력', join: '참여', editProfile: '프로필 수정', 
                save: '저장', cancel: '취소', recommended: '회원님을 위한 추천', exportData: '데이터 백업 (JSON)', demoMode: '체험 모드',
                myBadges: '나의 뱃지', levelUp: '레벨 업!', xpEarned: 'XP 획득', badgeAcquired: '뱃지 획득!'
            },
            en: {
                login: 'Log In', signup: 'Sign Up', signupLink: 'Sign Up', loginLink: 'Log In',
                noAccount: "No account?", hasAccount: 'Have account?',
                emailPlace: 'Email', pwPlace: 'Password', nickPlace: 'Nickname',
                loginFail: 'Enter info.', emailDup: 'Email exists.',
                fillAll: 'Fill all fields.', welcome: 'Welcome', explore: 'Explore', nodes: 'Nodes',
                stories: 'Stories', profile: 'Profile', upload: 'Upload', logout: 'Log Out', myUploads: 'My Uploads',
                createTitle: 'Create New', uploadMoment: 'Add Photo', uploadVideo: 'Add Video',
                uploadWebtoon: 'Add Cover', momentTitle: 'Title', videoTitle: 'Video Title',
                webtoonTitle: 'Webtoon Title', webtoonDesc: 'Write the plot/synopsis...',
                commentPlace: 'Comment...', follow: 'Follow', following: 'Following', loginProcessing: 'Logging in...', errorAuth: 'Error',
                noUploads: 'No uploads yet.', chat: 'Chat', groupChat: 'Group Chat', findGroup: 'Find Group',
                createGroup: 'Create Group', newMsg: 'New Message', groupName: 'Group Name', join: 'Join', editProfile: 'Edit Profile', 
                save: 'Save', cancel: 'Cancel', recommended: 'Recommended', exportData: 'Backup Data (JSON)', demoMode: 'Demo Mode',
                myBadges: 'My Badges', levelUp: 'Level Up!', xpEarned: 'XP Earned', badgeAcquired: 'Badge Acquired!'
            },
            // ... (다른 언어는 생략, 영어/한국어 우선 적용)
        };

        const LANG_NAMES = { ko: '한국어', en: 'English', zh: '中文', es: 'Español', fr: 'Français', ja: '日本語' };

        // --- 초기 데이터 ---
        const INITIAL_POSTS = [
            { id: 1, category: 'Moment', author: 'Sapcore_Creator', authorAvatar: 'https://i.pravatar.cc/100?u=Sapcore', title: '미래의 소셜 미디어', preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', stats: { engagement: '98%' }, tags: ['tech', 'future'] },
            { id: 2, category: 'Concept', author: 'Tech_Flow', authorAvatar: 'https://i.pravatar.cc/100?u=Tech', title: '디자인 시스템', preview: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', stats: { engagement: '85%' }, tags: ['design', 'ui'] }
        ];
        const INITIAL_VIDEOS = [
            { id: 1, title: 'Generative Art', author: 'Visual_X', views: '1.5M', thumb: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600', tags: ['art'] },
            { id: 2, title: 'Neon City', author: 'CyberRunner', views: '890K', thumb: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600', tags: ['cyberpunk'] }
        ];
        const INITIAL_WEBTOONS = [
            { id: 1, title: '침묵의 궤도', desc: '먼 우주, 홀로 남겨진 탐사선의 기록...', score: '9.9', author: '루나', img: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400', tags: ['sf'] }
        ];
        const INITIAL_CHAT_GROUPS = [
            { id: 1, name: 'Webtoon Artists', members: 124, lastMsg: '새로운 챕터 언제 나오나요?' },
            { id: 2, name: 'Video Creators', members: 89, lastMsg: '편집 효과 대박이네요' },
            { id: 3, name: 'Global Friends', members: 350, lastMsg: 'Hello everyone!' }
        ];

        // --- 메인 컴포넌트 ---
        const App = () => {
            // 상태 관리
            const [user, setUser] = useState(null);
            const [activeTab, setActiveTab] = useState('explore');
            const [language, setLanguage] = useState('ko');
            const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
            
            const [posts, setPosts] = useState(INITIAL_POSTS);
            const [videos, setVideos] = useState(INITIAL_VIDEOS);
            const [webtoons, setWebtoons] = useState(INITIAL_WEBTOONS);
            const [followingList, setFollowingList] = useState([]);
            const [commentsData, setCommentsData] = useState({});
            const [activePostForComments, setActivePostForComments] = useState(null);
            const [commentInput, setCommentInput] = useState('');
            const [liked, setLiked] = useState({});
            const [userInterests, setUserInterests] = useState([]);
            
            const [authMode, setAuthMode] = useState('login');
            const [authForm, setAuthForm] = useState({ email: '', password: '', nickname: '', avatar: null });
            const [isLoading, setIsLoading] = useState(false);
            const [loginError, setLoginError] = useState('');

            // UI 상태
            const [showCompose, setShowCompose] = useState(false);
            const [uploadType, setUploadType] = useState('moment');
            const [inputData, setInputData] = useState({ text: '', desc: '', file: null });
            // videoFilter 삭제됨
            const [isEditingProfile, setIsEditingProfile] = useState(false);
            const [editNameInput, setEditNameInput] = useState('');
            
            const [showChat, setShowChat] = useState(false);
            const [chatTab, setChatTab] = useState('my');
            const [chatGroups, setChatGroups] = useState(INITIAL_CHAT_GROUPS);
            const [publicGroups, setPublicGroups] = useState([
                { id: 101, name: 'K-Pop Fans', members: 500, desc: 'BTS, Blackpink...' },
                { id: 102, name: 'Coding Study', members: 42, desc: 'React & Firebase' }
            ]);
            const [newGroupName, setNewGroupName] = useState('');

            // 알림 & 레벨업
            const [notification, setNotification] = useState(null);
            const [levelUpModal, setLevelUpModal] = useState(false); // 레벨업 축하 모달

            // 알림 시뮬레이션
            useEffect(() => {
                if (user) {
                    const timer = setTimeout(() => {
                        setNotification({
                            id: Date.now(),
                            title: t.newMsg,
                            message: 'Webtoon Artists: New message!',
                            icon: MessageSquare
                        });
                        setTimeout(() => setNotification(null), 3000);
                    }, 5000);
                    return () => clearTimeout(timer);
                }
            }, [user, t.newMsg]);

            const getRecommendationScore = (tags) => {
                if (!tags || tags.length === 0) return 0;
                const matches = tags.filter(tag => userInterests.includes(tag));
                return matches.length;
            };

            const handleLike = (id, tags) => {
                setLiked(prev => ({...prev, [id]: !prev[id]}));
                if (tags && tags.length > 0) {
                    setUserInterests(prev => [...new Set([...prev, ...tags])]);
                }
            };

            // 핸들러: 인증 (즉시 처리)
            const handleAuth = (e) => {
                e.preventDefault();
                setLoginError('');

                if (!authForm.email || !authForm.password) { setLoginError(t.fillAll); return; }
                if (authMode === 'signup' && !authForm.nickname) { setLoginError(t.fillAll); return; }

                // 초기 사용자 상태 (XP, Badges 추가)
                const mockUser = {
                    email: authForm.email,
                    nickname: authForm.nickname || authForm.email.split('@')[0],
                    avatar: authForm.avatar || `https://i.pravatar.cc/150?u=${authForm.email}`,
                    stats: { works: 0 },
                    xp: 0,
                    level: 1,
                    badges: ['Starter'] // 기본 뱃지
                };
                setUser(mockUser);
            };

            // 핸들러: 업로드 (XP 및 레벨업 로직 추가)
            const handleUpload = () => {
                if (!inputData.text) return;
                
                // XP 획득 로직
                const xpGain = 50;
                let newXp = user.xp + xpGain;
                let newLevel = Math.floor(newXp / 100) + 1; // 100 XP당 1레벨
                let newBadges = [...user.badges];
                let leveledUp = false;

                if (newLevel > user.level) {
                    leveledUp = true;
                    setLevelUpModal(true); // 레벨업 모달 표시
                    setTimeout(() => setLevelUpModal(false), 3000);
                }

                // 뱃지 획득 로직
                if (newLevel >= 5 && !newBadges.includes('Creator')) newBadges.push('Creator');
                if (newLevel >= 10 && !newBadges.includes('Master')) newBadges.push('Master');

                const newItem = {
                    id: Date.now(),
                    author: user.nickname,
                    authorAvatar: user.avatar,
                    title: inputData.text,
                    desc: inputData.desc, // 웹툰 줄거리
                    preview: inputData.file || `https://picsum.photos/seed/${Date.now()}/800/600`,
                    thumb: inputData.file || `https://picsum.photos/seed/${Date.now()}/800/600`,
                    img: inputData.file || `https://picsum.photos/seed/${Date.now()}/800/600`,
                    tags: ['new'],
                    stats: { engagement: 'New' },
                    views: '0',
                    score: '10.0'
                };

                if (uploadType === 'moment') {
                    setPosts([newItem, ...posts]);
                    setActiveTab('explore');
                } else if (uploadType === 'video') {
                    setVideos([newItem, ...videos]);
                    setActiveTab('nodes');
                } else {
                    setWebtoons([newItem, ...webtoons]);
                    setActiveTab('stories');
                }
                
                setUser({
                    ...user, 
                    xp: newXp, 
                    level: newLevel,
                    badges: newBadges,
                    stats: { ...user.stats, works: user.stats.works + 1 }
                });
                
                setShowCompose(false);
                setInputData({ text: '', desc: '', file: null });
            };

            const handleBackup = () => {
                const data = { user, posts, videos, webtoons, date: new Date() };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `sapcore_backup_${user.nickname}.json`;
                a.click();
            };

            const handleNameUpdate = () => {
                if(editNameInput.trim()) {
                    setUser({...user, nickname: editNameInput});
                    setIsEditingProfile(false);
                }
            };

            const handleCommentSubmit = () => {
                if(!commentInput.trim() || !activePostForComments) return;
                const newComment = { id: Date.now(), user: user.nickname, avatar: user.avatar, text: commentInput };
                setCommentsData(prev => ({...prev, [activePostForComments]: [...(prev[activePostForComments]||[]), newComment]}));
                setCommentInput('');
            };

            const handleCreateGroup = () => {
                if(!newGroupName.trim()) return;
                setChatGroups([...chatGroups, {id: Date.now(), name: newGroupName, lastMsg: 'New Group', members: 1}]);
                setNewGroupName('');
            };
            const handleJoinGroup = (g) => {
                if(!chatGroups.find(c => c.id === g.id)) {
                    setChatGroups([g, ...chatGroups]);
                    alert(t.join + "!");
                }
            };

            // 렌더링: 로그인 화면
            if (!user) {
                return (
                    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden bg-white text-black">
                        <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/3 bg-purple-200 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/3 bg-blue-200 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
                        
                        <div className="flex gap-2 mb-8 flex-wrap justify-center relative z-20">
                            {['ko', 'en', 'zh', 'es', 'fr', 'ja'].map(l => (
                                <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1 rounded-full border text-xs font-bold uppercase transition-all hover:bg-gray-100 ${language === l ? 'bg-black text-white scale-110 shadow-md hover:bg-black' : 'bg-white text-gray-400'}`}>
                                    {LANG_NAMES[l]}
                                </button>
                            ))}
                        </div>
                        
                        <div className="flex flex-col items-center mb-10 relative z-10">
                            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center rotate-12 shadow-2xl mb-4">
                                <Gem size={32} className="text-white" />
                            </div>
                            <h1 className="text-4xl font-black italic text-black">SAPCORE</h1>
                            <p className="text-gray-400 font-medium">Sapphire AI Core Universe</p>
                        </div>
                        
                        <form onSubmit={handleAuth} className="w-full max-w-sm space-y-4 relative z-10">
                            {authMode === 'signup' && (
                                <div className="space-y-4 animate-in fade-in">
                                    <div className="flex justify-center">
                                        <label className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 overflow-hidden relative hover:border-black transition-colors">
                                            {authForm.avatar ? <img src={authForm.avatar} className="w-full h-full object-cover" /> : <Camera className="text-gray-400" />}
                                            <input type="file" className="hidden" onChange={(e) => e.target.files[0] && setAuthForm({...authForm, avatar: URL.createObjectURL(e.target.files[0])})} />
                                        </label>
                                    </div>
                                    <input type="text" placeholder={t.nickPlace} className="w-full p-3 rounded-2xl border bg-gray-50 outline-none focus:ring-2 focus:ring-black text-black" value={authForm.nickname} onChange={e => setAuthForm({...authForm, nickname: e.target.value})} />
                                </div>
                            )}
                            <input type="email" placeholder={t.emailPlace} className="w-full p-3 rounded-2xl border bg-gray-50 outline-none focus:ring-2 focus:ring-black text-black" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} />
                            <input type="password" placeholder={t.pwPlace} className="w-full p-3 rounded-2xl border bg-gray-50 outline-none focus:ring-2 focus:ring-black text-black" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} />
                            <button type="submit" className="w-full py-4 bg-black text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-transform active:scale-95">
                                {authMode === 'login' ? t.login : t.signup}
                            </button>
                            {loginError && <p className="text-center text-red-500 text-xs font-bold bg-red-50 py-1 px-3 rounded-full inline-block">{loginError}</p>}
                        </form>
                        
                        <p className="mt-6 text-sm text-gray-400 relative z-10">
                            {authMode === 'login' ? t.noAccount : t.hasAccount} 
                            <button onClick={() => {setAuthMode(authMode === 'login' ? 'signup' : 'login'); setLoginError('');}} className="ml-1 text-black font-bold hover:underline cursor-pointer">{authMode === 'login' ? t.signupLink : t.loginLink}</button>
                        </p>
                    </div>
                );
            }

            // 렌더링: 메인 앱
            return (
                <div className="max-w-md mx-auto min-h-screen bg-[#F8F9FA] pb-24 relative shadow-2xl text-black">
                    {/* 레벨업 모달 */}
                    {levelUpModal && (
                        <div className="fixed inset-0 z-[80] flex items-center justify-center pointer-events-none">
                            <div className="bg-black/90 p-6 rounded-3xl text-white text-center animate-[scaleIn_0.3s] shadow-2xl">
                                <div className="text-4xl mb-2">🎉</div>
                                <h2 className="text-2xl font-black text-yellow-400 italic mb-1">{t.levelUp}</h2>
                                <p className="text-lg font-bold">LEVEL {user.level}</p>
                            </div>
                        </div>
                    )}

                    {/* 알림 */}
                    {notification && (
                        <div className="fixed top-4 left-4 right-4 z-[70] bg-white border border-gray-100 shadow-xl rounded-2xl p-4 flex items-center gap-3 animate-[slideDown_0.3s]">
                            <div className="bg-green-100 p-2 rounded-full text-green-600"><MessageSquare size={20} /></div>
                            <div><p className="text-xs font-bold text-gray-500">{notification.title}</p><p className="text-sm font-bold">{notification.message}</p></div>
                        </div>
                    )}

                    {/* 헤더 */}
                    <div className="sticky top-0 z-40 flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-xl">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center rotate-12 shadow-lg"><Gem size={18} className="text-white" /></div>
                            <span className="text-xl font-black italic">SAPCORE</span>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowChat(true)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"><MessageSquare size={20} /></button>
                            <div className="bg-white shadow-sm border rounded-full px-4 py-1.5 flex items-center gap-2"><Flame size={14} className="text-orange-500" /><span className="text-xs font-bold">{user.xp} XP</span></div>
                        </div>
                    </div>

                    {/* 메인 컨텐츠 */}
                    <div className="fade-in">
                        {activeTab === 'explore' && (
                            <div className="px-6 space-y-6 pt-4">
                                <div className="mb-4"><h2 className="text-3xl font-black">{t.explore}</h2><p className="text-sm text-gray-400">{t.welcome}, {user.nickname}!</p></div>
                                {[...posts].sort((a,b) => getRecommendationScore(b.tags) - getRecommendationScore(a.tags)).map(post => {
                                    const isRecommended = getRecommendationScore(post.tags) > 0;
                                    return (
                                        <div key={post.id} className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100 relative group">
                                            <div className="p-5 flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={post.authorAvatar} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                                                    <div><span className="text-xs font-bold block">@{post.author}</span><span className="text-[10px] text-gray-400">{post.category}</span></div>
                                                </div>
                                                {isRecommended && <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-500"><Sparkles size={10} /> {t.recommended}</div>}
                                            </div>
                                            <h3 className="px-5 text-xl font-bold leading-tight mb-2">{post.title}</h3>
                                            <div className="aspect-[16/10] bg-gray-100 mx-4 mb-4 rounded-2xl overflow-hidden"><img src={post.preview} className="w-full h-full object-cover transition-transform group-hover:scale-105" /></div>
                                            <div className="px-5 pb-5 flex gap-4 text-xs font-bold text-gray-400">
                                                <button onClick={() => handleLike(post.id, post.tags)} className={`flex items-center gap-1 ${liked[post.id] ? 'text-red-500' : ''}`}><Heart size={16} className={liked[post.id] ? 'fill-current' : ''} /> Like</button>
                                                <button onClick={() => setActivePostForComments(post.id)} className="flex items-center gap-1 hover:text-black"><MessageSquare size={16} /> Comment</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {activeTab === 'nodes' && (
                            <div className="px-6 space-y-6 pt-4">
                                <h2 className="text-3xl font-black mb-4">{t.nodes}</h2>
                                {[...videos].sort((a,b) => getRecommendationScore(b.tags) - getRecommendationScore(a.tags)).map(v => (
                                    <div key={v.id} className="bg-black rounded-[24px] overflow-hidden shadow-2xl relative group">
                                        <img src={v.thumb} className="w-full aspect-video object-cover opacity-80 transition-transform group-hover:scale-105" />
                                        <div className="absolute inset-0 flex flex-col justify-between p-5">
                                            <div className="self-end bg-white/10 backdrop-blur px-3 py-1 rounded-full text-[10px] text-white font-bold">{v.views} views</div>
                                            <div><p className="text-white text-lg font-bold">{v.title}</p><p className="text-white/60 text-xs">{v.author}</p></div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center"><PlayCircle size={32} className="text-white opacity-80" /></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'stories' && (
                            <div className="px-6 pt-4">
                                <h2 className="text-3xl font-black mb-4">{t.stories}</h2>
                                <div className="grid gap-4">
                                    {webtoons.map(w => (
                                        <div key={w.id} className="flex gap-4 bg-white p-3 rounded-[28px] border shadow-sm group hover:shadow-md transition-shadow">
                                            <div className="w-24 h-32 rounded-2xl overflow-hidden flex-shrink-0"><img src={w.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /></div>
                                            <div className="flex flex-col justify-between py-1 flex-1">
                                                <div>
                                                    <div className="flex items-center gap-1 mb-1"><Star size={12} className="text-yellow-400 fill-current" /><span className="text-[10px] font-bold">{w.score}</span></div>
                                                    <h4 className="font-bold">{w.title}</h4>
                                                    <p className="text-xs text-gray-500 line-clamp-2">{w.desc}</p>
                                                </div>
                                                <button className="text-xs font-black flex items-center gap-2 mt-2">Read <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center"><Plus size={14} /></div></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="px-6 py-8">
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-6 w-32 h-32 rounded-[48px] bg-gradient-to-br from-indigo-500 to-pink-500 p-1 rotate-3">
                                        <img src={user.avatar} className="w-full h-full rounded-[44px] border-4 border-white object-cover -rotate-3" />
                                    </div>
                                    {isEditingProfile ? (
                                        <div className="flex items-center gap-2 mb-2">
                                            <input value={editNameInput} onChange={e => setEditNameInput(e.target.value)} className="text-2xl font-black text-center bg-gray-100 rounded p-1 w-32 outline-none" autoFocus />
                                            <button onClick={handleNameUpdate} className="p-1 bg-black text-white rounded-full"><Check size={14} /></button>
                                            <button onClick={() => setIsEditingProfile(false)} className="p-1 bg-gray-200 rounded-full"><X size={14} /></button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 mb-1">
                                            <h2 className="text-2xl font-black italic uppercase">{user.nickname}</h2>
                                            <button onClick={() => {setEditNameInput(user.nickname); setIsEditingProfile(true)}}><Edit2 size={14} className="text-gray-400 hover:text-black" /></button>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full">Lv.{user.level}</span>
                                        <p className="text-gray-400 text-sm">{user.email}</p>
                                    </div>

                                    {/* 뱃지 섹션 */}
                                    <div className="w-full bg-gray-50 rounded-2xl p-4 mb-6">
                                        <h4 className="text-left text-xs font-bold text-gray-400 mb-3 uppercase">{t.myBadges}</h4>
                                        <div className="flex gap-3">
                                            {user.badges.map((badge, i) => (
                                                <div key={i} className="flex flex-col items-center gap-1">
                                                    <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-yellow-500 shadow-sm">
                                                        {badge === 'Starter' && <Award size={20} />}
                                                        {badge === 'Creator' && <Medal size={20} />}
                                                        {badge === 'Master' && <Crown size={20} />}
                                                        {badge === 'Beginner' && <Star size={20} />}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-500">{badge}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-8 mb-8 w-full justify-center">
                                        <div><p className="text-[10px] text-gray-400 font-black">WORKS</p><p className="text-xl font-black">{user.stats.works}</p></div>
                                        <div><p className="text-[10px] text-gray-400 font-black">FOLLOWING</p><p className="text-xl font-black text-indigo-600">{followingList.length}</p></div>
                                        <div><p className="text-[10px] text-gray-400 font-black">FOLLOWERS</p><p className="text-xl font-black">0</p></div>
                                    </div>
                                    <div className="flex gap-2 w-full mb-8">
                                        <button onClick={handleBackup} className="flex-1 py-3 bg-gray-900 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"><Download size={14} /> {t.exportData}</button>
                                        <button onClick={() => setUser(null)} className="flex-1 py-3 bg-gray-100 text-red-500 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"><LogOut size={14} /> {t.logout}</button>
                                    </div>
                                </div>
                                <div className="border-t pt-6">
                                    <h3 className="font-bold mb-4 text-sm">{t.myUploads}</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {posts.filter(p => p.author === user.nickname).map(p => <div key={p.id} className="aspect-square bg-gray-200 rounded-xl overflow-hidden"><img src={p.preview} className="w-full h-full object-cover" /></div>)}
                                        {videos.filter(v => v.author === user.nickname).map(v => <div key={v.id} className="aspect-square bg-black rounded-xl overflow-hidden relative"><img src={v.thumb} className="w-full h-full object-cover opacity-80" /><PlayCircle className="absolute inset-0 m-auto text-white" /></div>)}
                                        {webtoons.filter(w => w.author === user.nickname).map(w => <div key={`w-${w.id}`} className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative"><img src={w.img} className="w-full h-full object-cover" /><span className="absolute bottom-1 right-1 bg-black text-white text-[8px] px-1 rounded">TOON</span></div>)}
                                        {(posts.filter(p => p.author === user.nickname).length + videos.filter(v => v.author === user.nickname).length + webtoons.filter(w => w.author === user.nickname).length) === 0 && <p className="col-span-3 text-center text-xs text-gray-400 py-4">{t.noUploads}</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 업로드 모달 (동영상 편집 삭제됨 / 웹툰 줄거리 추가됨) */}
                    {showCompose && (
                        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-[fadeIn_0.2s]">
                            <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative">
                                <button onClick={() => setShowCompose(false)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20} /></button>
                                <h3 className="text-xl font-black mb-4">{t.createTitle}</h3>
                                <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-2xl">
                                    {[{id:'moment',icon:Compass}, {id:'video',icon:Film}, {id:'webtoon',icon:PenTool}].map(type => (
                                        <button key={type.id} onClick={() => setUploadType(type.id)} className={`flex-1 py-3 rounded-xl flex justify-center items-center gap-1 text-xs font-bold transition-all ${uploadType === type.id ? 'bg-white shadow text-black' : 'text-gray-400'}`}><type.icon size={14} /> {type.id}</button>
                                    ))}
                                </div>
                                <div className="space-y-3 mb-6">
                                    <input type="text" placeholder={t.momentTitle} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold focus:ring-2 focus:ring-black/10 transition-all" value={inputData.text} onChange={e => setInputData({...inputData, text: e.target.value})} />
                                    
                                    {/* 웹툰 줄거리 입력창 (웹툰 선택 시에만 표시) */}
                                    {uploadType === 'webtoon' && (
                                        <textarea 
                                            placeholder={t.webtoonDesc} 
                                            className="w-full h-24 p-4 bg-gray-50 rounded-2xl border-none outline-none resize-none focus:ring-2 focus:ring-black/10 transition-all"
                                            value={inputData.desc || ''}
                                            onChange={e => setInputData({...inputData, desc: e.target.value})}
                                        />
                                    )}

                                    <label className="block w-full h-32 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 relative overflow-hidden transition-colors">
                                        {inputData.file ? <img src={inputData.file} className="w-full h-full object-cover" /> : <div className="text-gray-400 flex flex-col items-center"><ImageIcon /><span className="text-xs font-bold mt-1">{t.uploadMoment}</span></div>}
                                        <input type="file" className="hidden" onChange={e => e.target.files[0] && setInputData({...inputData, file: URL.createObjectURL(e.target.files[0])})} />
                                    </label>
                                </div>
                                <button onClick={handleUpload} className="w-full py-4 bg-black text-white rounded-2xl font-bold flex justify-center gap-2 hover:bg-gray-800 active:scale-95 transition-all"><span>{t.upload}</span> <Send size={16} /></button>
                            </div>
                        </div>
                    )}

                    {/* 채팅 모달 */}
                    {showChat && (
                        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-[fadeIn_0.2s]">
                            <div className="bg-white w-full max-w-sm rounded-[32px] h-[70vh] flex flex-col shadow-2xl overflow-hidden">
                                <div className="p-4 bg-gray-50 flex justify-between items-center border-b"><h3 className="font-black">{t.chat}</h3><button onClick={() => setShowChat(false)} className="p-2 bg-white rounded-full hover:bg-gray-200"><X size={18} /></button></div>
                                <div className="flex p-2 gap-2 bg-gray-50">
                                    <button onClick={() => setChatTab('my')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${chatTab === 'my' ? 'bg-black text-white' : 'text-gray-400'}`}>{t.groupChat}</button>
                                    <button onClick={() => setChatTab('find')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${chatTab === 'find' ? 'bg-black text-white' : 'text-gray-400'}`}>{t.findGroup}</button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {chatTab === 'my' ? (
                                        <>
                                            <div className="flex gap-2 mb-2"><input type="text" placeholder={t.groupName} className="flex-1 bg-gray-100 rounded-xl px-3 text-sm border-none outline-none" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} /><button onClick={handleCreateGroup} className="p-2 bg-black text-white rounded-xl active:scale-95"><Plus size={18} /></button></div>
                                            {chatGroups.map(g => <div key={g.id} className="flex items-center gap-3 p-3 border rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors"><div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600"><Users size={20} /></div><div><p className="font-bold text-sm">{g.name}</p><p className="text-xs text-gray-400">{g.lastMsg}</p></div></div>)}
                                        </>
                                    ) : (
                                        publicGroups.map(g => <div key={g.id} className="p-4 border rounded-2xl flex justify-between items-center hover:bg-gray-50"><div><p className="font-bold">{g.name}</p><p className="text-xs text-gray-400">{g.desc}</p></div><button onClick={() => handleJoinGroup(g)} className="px-3 py-1 bg-black text-white text-xs font-bold rounded-lg active:scale-95">{t.join}</button></div>)
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 댓글 모달 */}
                    {activePostForComments && (
                        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm animate-[fadeIn_0.2s]">
                            <div className="bg-white w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] h-[80vh] flex flex-col shadow-2xl relative">
                                <div className="p-4 border-b flex justify-between items-center"><h3 className="font-bold">Comments</h3><button onClick={() => setActivePostForComments(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={18}/></button></div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {(commentsData[activePostForComments] || []).map((c, i) => <div key={i} className="flex gap-2"><img src={c.avatar} className="w-8 h-8 rounded-full" /><div className="bg-gray-50 p-2 rounded-xl text-sm"><p className="font-bold text-xs">{c.user}</p>{c.text}</div></div>)}
                                    {(!commentsData[activePostForComments] || commentsData[activePostForComments].length === 0) && <p className="text-center text-gray-400 text-xs mt-10">No comments yet.</p>}
                                </div>
                                <div className="p-4 border-t flex gap-2"><input className="flex-1 bg-gray-100 rounded-xl px-3 outline-none focus:ring-1 focus:ring-black/10" value={commentInput} onChange={e=>setCommentInput(e.target.value)} placeholder={t.commentPlace} /><button onClick={handleCommentSubmit} className="p-2 bg-black text-white rounded-full active:scale-95"><Send size={16} /></button></div>
                            </div>
                        </div>
                    )}

                    {/* 하단 탭 바 */}
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-40">
                        <nav className="bg-white/90 backdrop-blur-md border border-white/50 shadow-2xl rounded-[32px] px-6 py-4 flex justify-between items-center">
                            <button onClick={() => setActiveTab('explore')} className={`transition-transform active:scale-90 ${activeTab === 'explore' ? 'text-black' : 'text-gray-300'}`}><Compass size={24} /></button>
                            <button onClick={() => setActiveTab('nodes')} className={`transition-transform active:scale-90 ${activeTab === 'nodes' ? 'text-black' : 'text-gray-300'}`}><PlayCircle size={24} /></button>
                            <div className="relative -top-8"><button onClick={() => setShowCompose(true)} className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform"><Plus size={32} /></button></div>
                            <button onClick={() => setActiveTab('stories')} className={`transition-transform active:scale-90 ${activeTab === 'stories' ? 'text-black' : 'text-gray-300'}`}><BookOpen size={24} /></button>
                            <button onClick={() => setActiveTab('profile')} className={`transition-transform active:scale-90 ${activeTab === 'profile' ? 'text-black' : 'text-gray-300'}`}><UserCircle2 size={24} /></button>
                        </nav>
                    </div>
                </div>
            );
        };

        const root = createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>