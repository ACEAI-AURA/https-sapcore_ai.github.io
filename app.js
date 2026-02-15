<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SAPCORE - Sapphire AI Core Universe</title>
    
    <!-- 스타일 및 폰트 -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;700;900&display=swap" rel="stylesheet">
    
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
        body { font-family: 'Noto Sans KR', sans-serif; background-color: #F8F9FA; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel" data-type="module">
        import React, { useState, useEffect } from 'react';
        import { createRoot } from 'react-dom/client';
        import { 
            Compass, Layers, PlayCircle, BookOpen, UserCircle2, Flame, 
            MessageSquare, Gem, Plus, ArrowUpRight, TrendingUp, Star, 
            Heart, X, Send, Image as ImageIcon, Film, PenTool, LogOut, 
            Mail, Lock, User, Camera, UserPlus, UserCheck, Globe, 
            Scissors, Users, Search, Bell, Edit2, Check, Sparkles, Download 
        } from 'lucide-react';

        // --- Firebase 설정 (CDN) ---
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
        import { getFirestore, collection, addDoc, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
        import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

        // Firebase 초기화 (실제 사용 시 본인의 키로 대체 필요, 없으면 로컬 모드 작동)
        let app, auth, db;
        const appId = 'sapcore-web-app';
        try {
            const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
            if (firebaseConfig) {
                app = initializeApp(firebaseConfig);
                auth = getAuth(app);
                db = getFirestore(app);
            }
        } catch (e) { console.log("Local Mode: Firebase not connected"); }

        // --- 번역 데이터 ---
        const TRANSLATIONS = {
            ko: {
                login: '로그인', signup: '회원가입 완료', signupLink: '회원가입하기', loginLink: '로그인하기',
                noAccount: '아직 계정이 없으신가요?', hasAccount: '이미 계정이 있으신가요?',
                emailPlace: '이메일 (E-mail)', pwPlace: '비밀번호 (Password)', nickPlace: '닉네임 (Nickname)',
                loginFail: '로그인 실패: 이메일 또는 비밀번호를 확인해주세요.', emailDup: '이미 가입된 이메일입니다.',
                fillAll: '모든 항목을 입력해주세요.', welcome: '환영합니다', explore: '탐색', nodes: '노드',
                stories: '스토리', profile: '프로필', upload: '업로드', logout: '로그아웃', myUploads: '내 작품들',
                createTitle: '새 작품 만들기', uploadMoment: '사진 추가', uploadVideo: '썸네일 업로드',
                uploadWebtoon: '표지 업로드', momentTitle: '제목을 입력하세요', videoTitle: '영상 제목을 입력하세요',
                webtoonTitle: '웹툰 제목을 입력하세요', webtoonDesc: '작품 설명...', commentPlace: '댓글 달기...',
                follow: '팔로우', following: '팔로잉', loginProcessing: '처리 중...', errorAuth: '오류 발생',
                noUploads: '아직 업로드한 작품이 없습니다.', chat: '채팅', groupChat: '단체 채팅', findGroup: '방 찾기',
                createGroup: '방 만들기', newMsg: '새 메시지', editVideo: '동영상 편집', applyFilter: '필터 적용',
                groupName: '방 이름 입력', join: '참여', editProfile: '프로필 수정', save: '저장', cancel: '취소',
                recommended: '회원님을 위한 추천', exportData: '데이터 백업 (JSON)'
            },
            en: {
                login: 'Log In', signup: 'Sign Up', signupLink: 'Sign Up', loginLink: 'Log In',
                noAccount: "No account?", hasAccount: 'Have account?',
                emailPlace: 'Email', pwPlace: 'Password', nickPlace: 'Nickname',
                loginFail: 'Login Failed.', emailDup: 'Email exists.',
                fillAll: 'Fill all fields.', welcome: 'Welcome', explore: 'Explore', nodes: 'Nodes',
                stories: 'Stories', profile: 'Profile', upload: 'Upload', logout: 'Log Out', myUploads: 'My Uploads',
                createTitle: 'Create New', uploadMoment: 'Add Photo', uploadVideo: 'Add Video',
                uploadWebtoon: 'Add Cover', momentTitle: 'Title', videoTitle: 'Video Title',
                webtoonTitle: 'Webtoon Title', webtoonDesc: 'Description...', commentPlace: 'Comment...',
                follow: 'Follow', following: 'Following', loginProcessing: 'Processing...', errorAuth: 'Error',
                noUploads: 'No uploads yet.', chat: 'Chat', groupChat: 'Group Chat', findGroup: 'Find Group',
                createGroup: 'Create Group', newMsg: 'New Message', editVideo: 'Edit Video', applyFilter: 'Filter',
                groupName: 'Group Name', join: 'Join', editProfile: 'Edit Profile', save: 'Save', cancel: 'Cancel',
                recommended: 'Recommended', exportData: 'Backup Data (JSON)'
            },
            // 중국어 등 다른 언어는 코드 길이상 생략되었으나 로직은 동일하게 확장 가능
            zh: {
                login: '登录', signup: '注册完成', signupLink: '注册', loginLink: '登录',
                noAccount: '没有账号？', hasAccount: '已有账号？',
                emailPlace: '邮箱', pwPlace: '密码', nickPlace: '昵称',
                loginFail: '登录失败', emailDup: '邮箱已注册',
                fillAll: '请填写所有', welcome: '欢迎', explore: '探索', nodes: '节点',
                stories: '故事', profile: '个人资料', upload: '上传', logout: '登出', myUploads: '我的作品',
                createTitle: '创作', uploadMoment: '加照片', uploadVideo: '加视频',
                uploadWebtoon: '加封面', momentTitle: '标题', videoTitle: '视频标题',
                webtoonTitle: '网漫标题', webtoonDesc: '简介...', commentPlace: '评论...',
                follow: '关注', following: '已关注', loginProcessing: '处理中...', errorAuth: '错误',
                noUploads: '无作品', chat: '聊天', groupChat: '群聊', findGroup: '找群',
                createGroup: '建群', newMsg: '新消息', editVideo: '编辑视频', applyFilter: '滤镜',
                groupName: '群名', join: '加入', editProfile: '编辑资料', save: '保存', cancel: '取消',
                recommended: '推荐', exportData: '备份数据 (JSON)'
            }
        };

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
            { id: 1, title: '침묵의 궤도', desc: 'SF 스릴러', score: '9.9', author: '루나', img: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400', tags: ['sf'] }
        ];

        // --- 메인 컴포넌트 ---
        const App = () => {
            // 상태 관리
            const [user, setUser] = useState(null);
            const [activeTab, setActiveTab] = useState('explore');
            const [language, setLanguage] = useState('ko');
            const t = TRANSLATIONS[language];
            
            const [posts, setPosts] = useState(INITIAL_POSTS);
            const [videos, setVideos] = useState(INITIAL_VIDEOS);
            const [webtoons, setWebtoons] = useState(INITIAL_WEBTOONS);
            
            const [authMode, setAuthMode] = useState('login');
            const [authForm, setAuthForm] = useState({ email: '', password: '', nickname: '', avatar: null });
            const [isLoading, setIsLoading] = useState(false);
            const [loginError, setLoginError] = useState('');

            // UI 상태
            const [showCompose, setShowCompose] = useState(false);
            const [uploadType, setUploadType] = useState('moment');
            const [inputData, setInputData] = useState({ text: '', desc: '', file: null });
            const [videoFilter, setVideoFilter] = useState('');
            const [isEditingVideo, setIsEditingVideo] = useState(false);
            
            const [showChat, setShowChat] = useState(false);
            const [chatTab, setChatTab] = useState('my');
            const [chatGroups, setChatGroups] = useState([{ id: 1, name: 'Webtoon Artists', members: 124, lastMsg: 'Hello!' }]);
            const [newGroupName, setNewGroupName] = useState('');

            // 알림
            const [notification, setNotification] = useState(null);

            // 초기화
            useEffect(() => {
                if (auth) {
                    const unsubscribe = onAuthStateChanged(auth, (u) => {
                        // Firebase 유저가 있으면 자동 로그인 처리 (실제 앱에서는 DB에서 추가 정보 로드 필요)
                        if (u && !user) {
                            setUser({ email: u.email || 'guest@sapcore.com', nickname: 'Guest', avatar: 'https://i.pravatar.cc/150', stats: { works: 0 } });
                        }
                    });
                    return () => unsubscribe();
                }
            }, []);

            // 핸들러: 인증
            const handleAuth = async (e) => {
                e.preventDefault();
                setIsLoading(true);
                setLoginError('');

                // 로컬 모드 (DB 없음)
                if (!auth) {
                    setTimeout(() => {
                        if (authMode === 'signup' && (!authForm.nickname || !authForm.email)) {
                            setLoginError(t.fillAll); setIsLoading(false); return;
                        }
                        const mockUser = {
                            email: authForm.email,
                            nickname: authForm.nickname || 'User',
                            avatar: authForm.avatar || `https://i.pravatar.cc/150?u=${authForm.email}`,
                            stats: { works: 0 }
                        };
                        setUser(mockUser);
                        setIsLoading(false);
                    }, 1000);
                    return;
                }

                // Firebase 모드 (코드가 실행될 때 키가 있으면 작동)
                // ... (Firebase Auth 로직은 실제 키가 있어야 작동하므로 생략, 위 로컬 모드로 동작)
            };

            // 핸들러: 업로드
            const handleUpload = () => {
                if (!inputData.text) return;
                const newItem = {
                    id: Date.now(),
                    author: user.nickname,
                    authorAvatar: user.avatar,
                    title: inputData.text,
                    desc: inputData.desc,
                    preview: inputData.file || `https://picsum.photos/seed/${Date.now()}/800/600`,
                    thumb: inputData.file || `https://picsum.photos/seed/${Date.now()}/800/600`,
                    img: inputData.file || `https://picsum.photos/seed/${Date.now()}/800/600`,
                    filter: videoFilter,
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
                
                setUser({...user, stats: {...user.stats, works: user.stats.works + 1}});
                setShowCompose(false);
                setInputData({ text: '', desc: '', file: null });
                setVideoFilter('');
            };

            // 핸들러: 데이터 백업
            const handleBackup = () => {
                const data = { user, posts, videos, webtoons, date: new Date() };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `sapcore_backup_${user.nickname}.json`;
                a.click();
            };

            // 렌더링: 로그인 화면
            if (!user) {
                return (
                    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
                        <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/3 bg-purple-200 rounded-full blur-[100px] opacity-50"></div>
                        <div className="flex gap-2 mb-8">
                            {['ko', 'en', 'zh'].map(l => (
                                <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${language === l ? 'bg-black text-white' : 'bg-white text-gray-400'}`}>{l}</button>
                            ))}
                        </div>
                        <div className="flex flex-col items-center mb-10">
                            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center rotate-12 shadow-2xl mb-4">
                                <Gem size={32} className="text-white" />
                            </div>
                            <h1 className="text-4xl font-black italic">SAPCORE</h1>
                            <p className="text-gray-400 font-medium">Sapphire AI Core Universe</p>
                        </div>
                        <form onSubmit={handleAuth} className="w-full max-w-sm space-y-4">
                            {authMode === 'signup' && (
                                <div className="space-y-4 animate-in fade-in">
                                    <div className="flex justify-center">
                                        <label className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 overflow-hidden relative">
                                            {authForm.avatar ? <img src={authForm.avatar} className="w-full h-full object-cover" /> : <Camera className="text-gray-400" />}
                                            <input type="file" className="hidden" onChange={(e) => e.target.files[0] && setAuthForm({...authForm, avatar: URL.createObjectURL(e.target.files[0])})} />
                                        </label>
                                    </div>
                                    <input type="text" placeholder={t.nickPlace} className="w-full p-3 rounded-2xl border bg-gray-50 outline-none focus:ring-1 focus:ring-black" value={authForm.nickname} onChange={e => setAuthForm({...authForm, nickname: e.target.value})} />
                                </div>
                            )}
                            <input type="email" placeholder={t.emailPlace} className="w-full p-3 rounded-2xl border bg-gray-50 outline-none focus:ring-1 focus:ring-black" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} />
                            <input type="password" placeholder={t.pwPlace} className="w-full p-3 rounded-2xl border bg-gray-50 outline-none focus:ring-1 focus:ring-black" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} />
                            <button type="submit" disabled={isLoading} className="w-full py-4 bg-black text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50">
                                {isLoading ? t.loginProcessing : (authMode === 'login' ? t.login : t.signup)}
                            </button>
                            {loginError && <p className="text-center text-red-500 text-xs font-bold">{loginError}</p>}
                        </form>
                        <p className="mt-6 text-sm text-gray-400">
                            {authMode === 'login' ? t.noAccount : t.hasAccount} 
                            <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="ml-1 text-black font-bold hover:underline">{authMode === 'login' ? t.signupLink : t.loginLink}</button>
                        </p>
                    </div>
                );
            }

            // 렌더링: 메인 앱
            return (
                <div className="max-w-md mx-auto min-h-screen bg-[#F8F9FA] pb-24 relative shadow-2xl">
                    {/* 상단 바 */}
                    <div className="sticky top-0 z-40 flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-xl">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center rotate-12 shadow-lg"><Gem size={18} className="text-white" /></div>
                            <span className="text-xl font-black italic">SAPCORE</span>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowChat(true)} className="p-2 bg-white rounded-full shadow-sm"><MessageSquare size={20} /></button>
                            <div className="bg-white shadow-sm border rounded-full px-4 py-1.5 flex items-center gap-2"><Flame size={14} className="text-orange-500" /><span className="text-xs font-bold">{1240 + user.stats.works * 50} XP</span></div>
                        </div>
                    </div>

                    {/* 메인 컨텐츠 */}
                    <div className="fade-in">
                        {activeTab === 'explore' && (
                            <div className="px-6 space-y-6 pt-4">
                                <div className="mb-4"><h2 className="text-3xl font-black">{t.explore}</h2><p className="text-sm text-gray-400">{t.welcome}, {user.nickname}!</p></div>
                                {posts.map(post => (
                                    <div key={post.id} className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100">
                                        <div className="p-5 flex items-center gap-3">
                                            <img src={post.authorAvatar} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                                            <div><span className="text-xs font-bold block">@{post.author}</span><span className="text-[10px] text-gray-400">{post.category}</span></div>
                                        </div>
                                        <div className="px-5 pb-2"><h3 className="text-xl font-bold">{post.title}</h3></div>
                                        <div className="aspect-[16/10] bg-gray-100 mx-4 mb-4 rounded-2xl overflow-hidden"><img src={post.preview} className="w-full h-full object-cover" /></div>
                                        <div className="px-5 pb-5 flex gap-4 text-xs font-bold text-gray-400">
                                            <button className="flex items-center gap-1 hover:text-red-500"><Heart size={16} /> Like</button>
                                            <button className="flex items-center gap-1 hover:text-black"><MessageSquare size={16} /> Comment</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'nodes' && (
                            <div className="px-6 space-y-6 pt-4">
                                <h2 className="text-3xl font-black mb-4">{t.nodes}</h2>
                                {videos.map(v => (
                                    <div key={v.id} className="bg-black rounded-[24px] overflow-hidden shadow-2xl relative group">
                                        <img src={v.thumb} className="w-full aspect-video object-cover opacity-80" style={{filter: v.filter}} />
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
                                        <div key={w.id} className="flex gap-4 bg-white p-3 rounded-[28px] border shadow-sm">
                                            <div className="w-24 h-32 rounded-2xl overflow-hidden flex-shrink-0"><img src={w.img} className="w-full h-full object-cover" /></div>
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
                                    <div className="w-32 h-32 rounded-[48px] bg-gradient-to-br from-indigo-500 to-pink-500 p-1 rotate-3 mb-4">
                                        <img src={user.avatar} className="w-full h-full rounded-[44px] border-4 border-white object-cover -rotate-3" />
                                    </div>
                                    <h2 className="text-2xl font-black italic uppercase mb-1">{user.nickname}</h2>
                                    <p className="text-gray-400 text-sm mb-6">{user.email}</p>
                                    <div className="flex gap-8 mb-8">
                                        <div><p className="text-[10px] text-gray-400 font-black">WORKS</p><p className="text-xl font-black">{user.stats.works}</p></div>
                                        <div><p className="text-[10px] text-gray-400 font-black">FOLLOWING</p><p className="text-xl font-black text-indigo-600">0</p></div>
                                        <div><p className="text-[10px] text-gray-400 font-black">FOLLOWERS</p><p className="text-xl font-black">0</p></div>
                                    </div>
                                    <div className="flex gap-2 w-full mb-8">
                                        <button onClick={handleBackup} className="flex-1 py-3 bg-gray-900 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2"><Download size={14} /> {t.exportData}</button>
                                        <button onClick={() => setUser(null)} className="flex-1 py-3 bg-gray-100 text-red-500 rounded-2xl text-xs font-bold flex items-center justify-center gap-2"><LogOut size={14} /> {t.logout}</button>
                                    </div>
                                </div>
                                <div className="border-t pt-6">
                                    <h3 className="font-bold mb-4 text-sm">{t.myUploads}</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {posts.filter(p => p.author === user.nickname).map(p => <div key={p.id} className="aspect-square bg-gray-200 rounded-xl overflow-hidden"><img src={p.preview} className="w-full h-full object-cover" /></div>)}
                                        {posts.filter(p => p.author === user.nickname).length === 0 && <p className="col-span-3 text-center text-xs text-gray-400 py-4">{t.noUploads}</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 업로드 모달 */}
                    {showCompose && (
                        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                            <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative animate-[slideUp_0.3s]">
                                <button onClick={() => setShowCompose(false)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full"><X size={20} /></button>
                                <h3 className="text-xl font-black mb-4">{t.createTitle}</h3>
                                <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-2xl">
                                    {[{id:'moment',icon:Compass}, {id:'video',icon:Film}, {id:'webtoon',icon:PenTool}].map(type => (
                                        <button key={type.id} onClick={() => setUploadType(type.id)} className={`flex-1 py-3 rounded-xl flex justify-center items-center gap-1 text-xs font-bold ${uploadType === type.id ? 'bg-white shadow text-black' : 'text-gray-400'}`}><type.icon size={14} /> {type.id}</button>
                                    ))}
                                </div>
                                <div className="space-y-3 mb-6">
                                    <input type="text" placeholder={t.momentTitle} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold" value={inputData.text} onChange={e => setInputData({...inputData, text: e.target.value})} />
                                    {uploadType === 'video' && (
                                        <div className="bg-gray-50 p-3 rounded-2xl">
                                            <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold">{t.editVideo}</span></div>
                                            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                                {['none', 'grayscale(100%)', 'sepia(80%)', 'invert(100%)'].map((f, i) => (
                                                    <button key={i} onClick={() => setVideoFilter(f === 'none' ? '' : f)} className="h-8 px-3 rounded bg-white text-[10px] border shadow-sm whitespace-nowrap">Filter {i}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <label className="block w-full h-32 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 relative overflow-hidden">
                                        {inputData.file ? <img src={inputData.file} className="w-full h-full object-cover" style={{filter: videoFilter}} /> : <div className="text-gray-400 flex flex-col items-center"><ImageIcon /><span className="text-xs font-bold mt-1">{t.uploadMoment}</span></div>}
                                        <input type="file" className="hidden" onChange={e => e.target.files[0] && setInputData({...inputData, file: URL.createObjectURL(e.target.files[0])})} />
                                    </label>
                                </div>
                                <button onClick={handleUpload} className="w-full py-4 bg-black text-white rounded-2xl font-bold flex justify-center gap-2"><span>{t.upload}</span> <Send size={16} /></button>
                            </div>
                        </div>
                    )}

                    {/* 채팅 모달 */}
                    {showChat && (
                        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
                            <div className="bg-white w-full max-w-sm rounded-[32px] h-[70vh] flex flex-col shadow-2xl overflow-hidden">
                                <div className="p-4 bg-gray-50 flex justify-between items-center border-b"><h3 className="font-black">{t.chat}</h3><button onClick={() => setShowChat(false)} className="p-2 bg-white rounded-full"><X size={18} /></button></div>
                                <div className="flex p-2 gap-2 bg-gray-50">
                                    <button onClick={() => setChatTab('my')} className={`flex-1 py-2 text-xs font-bold rounded-xl ${chatTab === 'my' ? 'bg-black text-white' : 'text-gray-400'}`}>{t.groupChat}</button>
                                    <button onClick={() => setChatTab('find')} className={`flex-1 py-2 text-xs font-bold rounded-xl ${chatTab === 'find' ? 'bg-black text-white' : 'text-gray-400'}`}>{t.findGroup}</button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {chatTab === 'my' ? (
                                        <>
                                            <div className="flex gap-2 mb-2"><input type="text" placeholder={t.groupName} className="flex-1 bg-gray-100 rounded-xl px-3 text-sm border-none outline-none" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} /><button onClick={() => {if(newGroupName){setChatGroups([...chatGroups, {id:Date.now(), name:newGroupName, lastMsg:'New'}]); setNewGroupName('')}}} className="p-2 bg-black text-white rounded-xl"><Plus size={18} /></button></div>
                                            {chatGroups.map(g => <div key={g.id} className="flex items-center gap-3 p-3 border rounded-2xl"><div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600"><Users size={20} /></div><div><p className="font-bold text-sm">{g.name}</p><p className="text-xs text-gray-400">{g.lastMsg}</p></div></div>)}
                                        </>
                                    ) : (
                                        publicGroups.map(g => <div key={g.id} className="p-4 border rounded-2xl flex justify-between items-center"><div><p className="font-bold">{g.name}</p><p className="text-xs text-gray-400">{g.desc}</p></div><button onClick={() => {setChatGroups([...chatGroups, {...g, lastMsg: 'Joined'}]); alert('Joined!');}} className="px-3 py-1 bg-black text-white text-xs font-bold rounded-lg">{t.join}</button></div>)
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 하단 탭 바 */}
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-40">
                        <nav className="bg-white/90 backdrop-blur-md border border-white/50 shadow-2xl rounded-[32px] px-6 py-4 flex justify-between items-center">
                            <button onClick={() => setActiveTab('explore')}><Compass size={24} className={activeTab === 'explore' ? 'text-black' : 'text-gray-300'} /></button>
                            <button onClick={() => setActiveTab('nodes')}><PlayCircle size={24} className={activeTab === 'nodes' ? 'text-black' : 'text-gray-300'} /></button>
                            <div className="relative -top-8"><button onClick={() => setShowCompose(true)} className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"><Plus size={32} /></button></div>
                            <button onClick={() => setActiveTab('stories')}><BookOpen size={24} className={activeTab === 'stories' ? 'text-black' : 'text-gray-300'} /></button>
                            <button onClick={() => setActiveTab('profile')}><UserCircle2 size={24} className={activeTab === 'profile' ? 'text-black' : 'text-gray-300'} /></button>
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
