import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Briefcase, TrendingUp, Terminal, AlertTriangle, Clock, Users, Activity, DollarSign, FileText, Play, CheckCircle, Zap, FileLock2, BookOpen, Scale, Palette, Code, CheckSquare, Layers, Cpu, HelpCircle, BarChart3, Settings2, FolderDot, Send, MessageSquare, Sparkles, LayoutDashboard, ArrowRight, ChevronLeft, ChevronRight, Image, Instagram, Save, Check, Lock, Download, SlidersHorizontal } from 'lucide-react';
// Sequence: Operations removed. Research -> Validation -> Competitor...
const DEPT_SEQUENCE = [
    'Research', 'Validation', 'Competitor', 'Finance', 'Legal', 'Brand',
    'Product', 'Design', 'Engineering', 'QA', 'Marketing', 'Sales',
    'Support', 'Analytics', 'Conflict'
];
export default function App() {
    const [workspaceId, setWorkspaceId] = useState('default-workspace');
    const [objective, setObjective] = useState('');
    const [context, setContext] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [logs, setLogs] = useState([]);
    const [conflicts, setConflicts] = useState([]);
    const [vaultEntries, setVaultEntries] = useState([]);
    // Navigation & States
    const [hasIdeaLaunched, setHasIdeaLaunched] = useState(false);
    const [activeView, setActiveView] = useState('overview');
    // Vault Form State
    const [vaultKeyType, setVaultKeyType] = useState('bank_account');
    const [vaultPayload, setVaultPayload] = useState('');
    // Department Chatbot State mapping
    const [chatHistories, setChatHistories] = useState({});
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef(null);
    // Marketing Nano Banana & Insta mock
    const [bananaImages, setBananaImages] = useState([]);
    const [isGeneratingBanana, setIsGeneratingBanana] = useState(false);
    const [instaUsername, setInstaUsername] = useState('');
    const [instaStatus, setInstaStatus] = useState('disconnected');
    // Branding Pitch Deck Slide Stack
    const [pitchSlides, setPitchSlides] = useState([]);
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [isDeckGenerated, setIsDeckGenerated] = useState(false);
    const [slideEditingText, setSlideEditingText] = useState('');
    const [showSavedNotification, setShowSavedNotification] = useState(false);
    // Validation department custom questionnaire inputs
    const [validationBudget, setValidationBudget] = useState('');
    const [validationIdeaText, setValidationIdeaText] = useState('');
    const [validationFinStage, setValidationFinStage] = useState('Bootstrapped');
    const [isSavingValidationInputs, setIsSavingValidationInputs] = useState(false);
    // Budget Refiner
    const [budgetRefinePrompt, setBudgetRefinePrompt] = useState('');
    const [isRefiningBudget, setIsRefiningBudget] = useState(false);
    const [inputCompanyName, setInputCompanyName] = useState('');
    // Progressive flow completion state
    const [isCompletingStage, setIsCompletingStage] = useState(false);
    // Fetch current state
    const fetchData = async () => {
        try {
            const contextRes = await fetch(`/api/context?workspaceId=${workspaceId}`);
            if (contextRes.ok) {
                const ctxData = await contextRes.json();
                setContext(ctxData);
                // Auto-detect if workspace has an active idea launched
                if (ctxData.founderProfile.vision && ctxData.founderProfile.vision !== 'A simple SaaS platform') {
                    setHasIdeaLaunched(true);
                }
            }
            const tasksRes = await fetch(`/api/tasks?workspaceId=${workspaceId}`);
            if (tasksRes.ok) {
                const tasksData = await tasksRes.json();
                setTasks(tasksData);
            }
            const logsRes = await fetch('/api/logs');
            if (logsRes.ok) {
                const logsData = await logsRes.json();
                setLogs(logsData);
            }
            const conflictsRes = await fetch('/api/conflicts');
            if (conflictsRes.ok) {
                const conflictsData = await conflictsRes.json();
                setConflicts(conflictsData);
            }
            const vaultRes = await fetch('/api/vault');
            if (vaultRes.ok) {
                const vaultData = await vaultRes.json();
                setVaultEntries(vaultData);
            }
        }
        catch (err) {
            console.error('Error fetching dashboard metrics', err);
        }
    };
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 1500);
        return () => clearInterval(interval);
    }, [workspaceId]);
    // Prepopulate agent chat welcome messages
    useEffect(() => {
        if (activeView !== 'overview') {
            const existingHistory = chatHistories[activeView];
            if (!existingHistory) {
                let welcomeText = `Welcome to the **${activeView} Department**. I have loaded our active startup context. Ask me anything about our plans, deliverables, or strategy!`;
                if (activeView === 'Validation') {
                    welcomeText = `Welcome to the **Validation Department**. Let's review our PMF and feasibility metrics. To proceed, please enter your Budget, target description, and exact Financial Stage in the right-side configuration board.`;
                }
                setChatHistories(prev => ({
                    ...prev,
                    [activeView]: [
                        {
                            sender: 'agent',
                            text: welcomeText,
                            timestamp: new Date().toLocaleTimeString()
                        }
                    ]
                }));
            }
        }
    }, [activeView]);
    // Scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistories, activeView]);
    // Load saved pitch deck when entering Brand stage
    useEffect(() => {
        if (activeView === 'Brand') {
            fetch(`/api/brand/pitchdeck?workspaceId=${workspaceId}`)
                .then(res => {
                if (res.ok)
                    return res.json();
                throw new Error('Failed to load');
            })
                .then(data => {
                if (data.pitchDeck && data.pitchDeck.length > 0) {
                    setPitchSlides(data.pitchDeck);
                    setIsDeckGenerated(true);
                    setActiveSlideIdx(0);
                    setSlideEditingText(data.pitchDeck[0].body);
                }
            })
                .catch(err => console.error('Error loading pitch deck:', err));
        }
    }, [activeView, workspaceId]);
    // Submit dynamic trigger from onboarding portal
    const handleLaunch = async (e) => {
        e.preventDefault();
        if (!objective.trim())
            return;
        try {
            const res = await fetch('/api/execution/trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workspaceId, objective, companyName: inputCompanyName })
            });
            if (res.ok) {
                setHasIdeaLaunched(true);
                setActiveView('Research'); // Automatically route to Research Agent view
                setObjective('');
                setInputCompanyName('');
                fetchData();
            }
        }
        catch (err) {
            console.error('Error triggering execution loop', err);
        }
    };
    // Complete department and unlock next
    const handleCompleteDepartment = async () => {
        if (isCompletingStage || activeView === 'overview')
            return;
        setIsCompletingStage(true);
        try {
            const res = await fetch('/api/context/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workspaceId, currentDepartment: activeView })
            });
            if (res.ok) {
                const data = await res.json();
                // Switch client view to next unlocked department
                setActiveView(data.nextDepartment);
                fetchData();
            }
        }
        catch (err) {
            console.error('Error completing department', err);
        }
        finally {
            setIsCompletingStage(false);
        }
    };
    // Save Validation Questionnaire Inputs
    const handleSaveValidationInputs = async (e) => {
        e.preventDefault();
        if (!validationBudget.trim())
            return;
        setIsSavingValidationInputs(true);
        // Feed context to chat thread
        const userMsg = `Budget target: ${validationBudget} | Building: ${validationIdeaText} | Stage: ${validationFinStage}`;
        const newMsg = {
            sender: 'user',
            text: userMsg,
            timestamp: new Date().toLocaleTimeString()
        };
        setChatHistories(prev => ({
            ...prev,
            Validation: [...(prev[prev.Validation ? 'Validation' : 'Validation'] || []), newMsg]
        }));
        try {
            // Send chat context update
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ department: 'Validation', message: userMsg, workspaceId })
            });
            if (res.ok) {
                const data = await res.json();
                const agentMsg = {
                    sender: 'agent',
                    text: data.response,
                    timestamp: new Date().toLocaleTimeString()
                };
                setChatHistories(prev => ({
                    ...prev,
                    Validation: [...(prev.Validation || []), agentMsg]
                }));
            }
            // Automatically trigger a Finance budget optimization logic behind the scenes
            await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ department: 'Finance', message: `My budget is ${validationBudget}`, workspaceId })
            });
            fetchData();
        }
        catch (err) {
            console.error('Error validation details update:', err);
        }
        finally {
            setIsSavingValidationInputs(false);
        }
    };
    // Refine budget via AI
    const handleRefineBudget = async (e) => {
        e.preventDefault();
        if (!budgetRefinePrompt.trim() || isRefiningBudget)
            return;
        setIsRefiningBudget(true);
        // Append to finance chat
        const userMsg = `Refine budget: ${budgetRefinePrompt}`;
        setChatHistories(prev => ({
            ...prev,
            Finance: [...(prev.Finance || []), {
                    sender: 'user',
                    text: userMsg,
                    timestamp: new Date().toLocaleTimeString()
                }]
        }));
        try {
            const res = await fetch('/api/finance/refine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workspaceId, prompt: budgetRefinePrompt })
            });
            if (res.ok) {
                const data = await res.json();
                setContext(data.context);
                setBudgetRefinePrompt('');
                // Append response
                setChatHistories(prev => ({
                    ...prev,
                    Finance: [...(prev.Finance || []), {
                            sender: 'agent',
                            text: `Budget refinement processed successfully:
- Updated Runway: **${data.context.financials.runwayMonths} Months**
- Updated burn rate: **$${data.context.financials.burnRate}/mo**
- Updated Infra cost: **$${data.context.financials.infrastructureCost}/mo**`,
                            timestamp: new Date().toLocaleTimeString()
                        }]
                }));
            }
        }
        catch (err) {
            console.error('Error refining budget:', err);
        }
        finally {
            setIsRefiningBudget(false);
        }
    };
    // Submit local secure vault entry
    const handleVaultSubmit = async (e) => {
        e.preventDefault();
        if (!vaultPayload.trim())
            return;
        try {
            const entryId = 'vault-' + Math.random().toString(36).substring(7);
            const res = await fetch('/api/vault', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: entryId, keyType: vaultKeyType, encryptedPayload: vaultPayload })
            });
            if (res.ok) {
                setVaultPayload('');
                fetchData();
            }
        }
        catch (err) {
            console.error('Error saving to vault', err);
        }
    };
    // Resolve active conflict
    const handleConflictResolve = async (conflictId, resolution) => {
        try {
            const res = await fetch('/api/conflicts/resolve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conflictId, resolution })
            });
            if (res.ok) {
                fetchData();
            }
        }
        catch (err) {
            console.error('Error resolving conflict', err);
        }
    };
    // Chat submit
    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || isChatLoading)
            return;
        const userMsg = chatInput;
        setChatInput('');
        setIsChatLoading(true);
        const newMsg = {
            sender: 'user',
            text: userMsg,
            timestamp: new Date().toLocaleTimeString()
        };
        setChatHistories(prev => ({
            ...prev,
            [activeView]: [...(prev[activeView] || []), newMsg]
        }));
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ department: activeView, message: userMsg, workspaceId })
            });
            if (res.ok) {
                const data = await res.json();
                const agentMsg = {
                    sender: 'agent',
                    text: data.response,
                    timestamp: new Date().toLocaleTimeString()
                };
                setChatHistories(prev => ({
                    ...prev,
                    [activeView]: [...(prev[activeView] || []), agentMsg]
                }));
            }
        }
        catch (err) {
            console.error('Chat error', err);
        }
        finally {
            setIsChatLoading(false);
        }
    };
    // Generate GTM visuals via Nano Banana
    const triggerNanoBanana = () => {
        setIsGeneratingBanana(true);
        setTimeout(() => {
            const niche = context?.business.niche || 'Startup Product';
            setBananaImages([
                { type: 'Lifestyle Photography', prompt: `High-resolution visual layout of customers utilizing ${niche} on a modern screen, clean corporate lighting.` },
                { type: 'Instagram Post creative', prompt: `Obsidian-themed layout showcasing logo tokens, accent colors, and tagline "${context?.marketing.taglines[0] || 'Automate the core'}"` },
                { type: 'Hoodie / Merchandise mockup', prompt: `Minimalist dark mockup with front print layout showing company name "${context?.companyName}"` }
            ]);
            setIsGeneratingBanana(false);
        }, 2000);
    };
    // Instagram account hook
    const handleConnectInsta = (e) => {
        e.preventDefault();
        if (!instaUsername.trim())
            return;
        setInstaStatus('connecting');
        setTimeout(() => {
            setInstaStatus('connected');
        }, 1500);
    };
    // Pitch Deck Builder
    const generatePitchDeck = async () => {
        if (!context)
            return;
        const slides = [
            {
                title: 'Cover Slide',
                header: context.companyName,
                body: `Empowering ${context.business.targetMarket} through context-aware local intelligence. Built on the custom ${context.business.niche} framework.`
            },
            {
                title: 'The Problem',
                header: 'Manual Overhead and Information Loss',
                body: `Traditional businesses in ${context.business.niche} face severe task synchronization blocks, excessive manual coordination costs, and operational safety gaps.`
            },
            {
                title: 'The Solution',
                header: 'Orbit Autonomous Loop Orchestration',
                body: `An AI company working continuously inside local secure vaults. Coordinates Operations, Research, Finance, Brand, Design, Engineering, QA, and Marketing loops without human delays.`
            },
            {
                title: 'Market Opportunity',
                header: `TAM: ${context.business.tam || '$4.5 Billion'} / SAM: ${context.business.sam || '$820 Million'}`,
                body: `Targeting B2B operators within the ${context.business.niche} sector. Reaching +15.4% annual CAGR expansion indexes.`
            },
            {
                title: 'Business Model',
                header: 'Scalable B2B SaaS Tiers',
                body: `Proposing monthly subscription slots from $29/mo (entry validations) up to $199/mo (full code branch deployments and Stitch canvas integrations).`
            }
        ];
        setPitchSlides(slides);
        setActiveSlideIdx(0);
        setSlideEditingText(slides[0].body);
        setIsDeckGenerated(true);
        try {
            await fetch('/api/brand/pitchdeck', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workspaceId, pitchDeck: slides })
            });
        }
        catch (err) {
            console.error('Error saving generated pitch deck:', err);
        }
    };
    const handleSlideSelect = (idx) => {
        setActiveSlideIdx(idx);
        setSlideEditingText(pitchSlides[idx].body);
    };
    const handleSaveSlideText = async () => {
        const updated = [...pitchSlides];
        updated[activeSlideIdx].body = slideEditingText;
        setPitchSlides(updated);
        // Save to simulated context
        if (context) {
            const updatedCtx = { ...context };
            updatedCtx.marketing.brandVoice += ` | Updated slide: ${slideEditingText.substring(0, 30)}...`;
            setContext(updatedCtx);
        }
        try {
            await fetch('/api/brand/pitchdeck', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workspaceId, pitchDeck: updated })
            });
            setShowSavedNotification(true);
        }
        catch (err) {
            console.error('Error saving updated slide:', err);
        }
        setTimeout(() => setShowSavedNotification(false), 2000);
    };
    // Helper: Verify if department is unlocked under progression
    const isDeptUnlocked = (deptName) => {
        if (!context)
            return true;
        const activeStageIndex = DEPT_SEQUENCE.findIndex(d => d.toLowerCase() === context.business.stage.toLowerCase());
        const targetDeptIndex = DEPT_SEQUENCE.findIndex(d => d.toLowerCase() === deptName.toLowerCase());
        if (activeStageIndex === -1 || targetDeptIndex === -1)
            return true;
        return targetDeptIndex <= activeStageIndex;
    };
    // Get active status color for department nodes
    const getDeptStatus = (deptName) => {
        const activeTask = tasks.find(t => t.department.toLowerCase() === deptName.toLowerCase());
        if (!activeTask)
            return 'idle';
        return activeTask.status;
    };
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'inprogress':
                return 'bg-amber-100 text-amber-800 border border-amber-200/60 animate-pulse';
            case 'completed':
                return 'bg-emerald-100 text-emerald-850 border border-emerald-200/60';
            case 'failed':
                return 'bg-rose-100 text-rose-800 border border-rose-200/60';
            default:
                return 'bg-stone-200/60 text-stone-600 border border-stone-300/30';
        }
    };
    // Operations removed from client display lists
    const departmentsList = [
        { name: 'Research', icon: BookOpen, color: 'from-[#8c6d3b] to-[#bca374]', description: 'TAM/SAM validation, competitor audits, and gap reports.' },
        { name: 'Validation', icon: Activity, color: 'from-[#8c6d3b] to-[#c29f68]', description: 'ICP definitions, customer surveys, landing page conversion tests.' },
        { name: 'Competitor', icon: TrendingUp, color: 'from-[#8c6d3b] to-[#c29f68]', description: 'Scrapes features, tracks pricing indices, recommends USP direction.' },
        { name: 'Finance', icon: DollarSign, color: 'from-[#8c6d3b] to-[#bca374]', description: 'Runway calculator, burn-rate simulations, hiring infrastructure boards.' },
        { name: 'Legal', icon: Scale, color: 'from-[#8c6d3b] to-[#c29f68]', description: 'Founder agreements, compliance registers, trademark clearance audits.' },
        { name: 'Brand', icon: Palette, color: 'from-[#8c6d3b] to-[#bca374]', description: 'Colors, typography assets, taglines, GTM visual directories.' },
        { name: 'Product', icon: Layers, color: 'from-[#8c6d3b] to-[#c29f68]', description: 'Feature roadmap pipelines, user story points, PRD spec creation.' },
        { name: 'Design', icon: Palette, color: 'from-[#8c6d3b] to-[#bca374]', description: 'Stitch canvas layout coordination, prototypes, responsive frames.' },
        { name: 'Engineering', icon: Code, color: 'from-[#8c6d3b] to-[#c29f68]', description: 'Synthesizes code files, sets up databases, deploys git repositories.' },
        { name: 'QA', icon: CheckSquare, color: 'from-[#8c6d3b] to-[#bca374]', description: 'Smoke tests, integration pipelines, accessibility audits.' },
        { name: 'Marketing', icon: Zap, color: 'from-[#8c6d3b] to-[#c29f68]', description: 'Outbound campaign scheduling, GTM social cards, Nano Banana design assets.' },
        { name: 'Sales', icon: Briefcase, color: 'from-[#8c6d3b] to-[#bca374]', description: 'Outreach pipelines, draft contracts, pricing tier calculators.' },
        { name: 'Support', icon: HelpCircle, color: 'from-[#8c6d3b] to-[#c29f68]', description: 'Builds FAQs, supports ticketers, reviews sentiment analysis.' },
        { name: 'Analytics', icon: BarChart3, color: 'from-[#8c6d3b] to-[#bca374]', description: 'Visitor heatmaps, purchase conversions, growth statistics.' },
        { name: 'Conflict', icon: Settings2, color: 'from-[#8c6d3b] to-[#c29f68]', description: 'Mediates department contradictions, outputs compromise logs.' }
    ];
    /* ----------------- RENDER ONBOARDING SCREEN ----------------- */
    if (!hasIdeaLaunched) {
        return (_jsxs("div", { className: "relative min-h-screen flex items-center justify-center bg-[#f6f4ee] overflow-hidden text-stone-850 px-4", children: [_jsx("div", { className: "glow-orb w-[700px] h-[700px] bg-amber-100/30 top-[-300px] left-[-300px]" }), _jsx("div", { className: "glow-orb w-[600px] h-[600px] bg-orange-100/20 bottom-[-300px] right-[-300px]" }), _jsxs("div", { className: "w-full max-w-xl z-10 text-center", children: [_jsx("div", { className: "flex justify-center mb-6", children: _jsx("div", { className: "flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-stone-800 to-stone-700 text-[#f6f4ee] shadow-[0_4px_20px_rgba(140,109,59,0.15)]", children: _jsx(FolderDot, { className: "w-8 h-8" }) }) }), _jsx("h1", { className: "text-4xl font-extrabold tracking-tight text-stone-900 font-outfit mb-3", children: "Orbit Autonomous Loop" }), _jsx("p", { className: "text-xs text-stone-500 uppercase tracking-widest font-mono mb-8", children: "The Autonomous Founder Operating System" }), _jsx("div", { className: "glass-panel rounded-2xl p-6 shadow-2xl bg-white/70", children: _jsxs("form", { onSubmit: handleLaunch, className: "flex flex-col gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-left text-xs text-stone-600 font-mono mb-2 uppercase tracking-wider", children: "Startup Name" }), _jsx("input", { type: "text", value: inputCompanyName, onChange: (e) => setInputCompanyName(e.target.value), placeholder: "e.g. AgriGrow", className: "w-full px-4 py-2 text-sm text-stone-850 rounded-xl bg-[#faf9f6] border border-stone-200 focus:outline-none focus:border-[#8c6d3b] placeholder:text-stone-400 font-sans mb-1", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-left text-xs text-stone-600 font-mono mb-2 uppercase tracking-wider", children: "Startup Vision / Idea" }), _jsx("textarea", { value: objective, onChange: (e) => setObjective(e.target.value), placeholder: "Describe your product idea... (e.g. 'Build an automated CRM system for organic farms')", className: "w-full h-24 p-4 text-sm text-stone-850 rounded-xl bg-[#faf9f6] border border-stone-200 focus:outline-none focus:border-[#8c6d3b] placeholder:text-stone-400 resize-none font-sans leading-relaxed focus:shadow-[0_0_20px_rgba(140,109,59,0.06)]", required: true })] }), _jsxs("button", { type: "submit", className: "w-full flex items-center justify-center gap-2.5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-stone-800 to-stone-750 hover:from-stone-900 hover:to-stone-800 rounded-xl transition duration-200 shadow-[0_4px_25px_rgba(140,109,59,0.12)]", children: [_jsx("span", { children: "Let's Ideate" }), _jsx(ArrowRight, { className: "w-4 h-4" })] })] }) }), _jsx("p", { className: "text-[10px] text-stone-500 mt-6 font-mono", children: "Orbit compiles code, generates design tokens, maps legal compliances, and tracks runways local first." })] })] }));
    }
    /* ----------------- RENDER MAIN APP LAYOUT ----------------- */
    return (_jsxs("div", { className: "flex min-h-screen bg-[#f6f4ee] text-stone-800 font-sans", children: [_jsx("div", { className: "glow-orb w-[600px] h-[600px] bg-amber-100/30 top-[-200px] left-[-200px]" }), _jsx("div", { className: "glow-orb w-[500px] h-[500px] bg-orange-100/20 bottom-[-200px] right-[-200px]" }), _jsxs("aside", { className: "w-64 border-r border-stone-200/80 bg-[#fbfaf7]/60 backdrop-blur-xl shrink-0 flex flex-col z-20", children: [_jsxs("div", { className: "p-5 border-b border-stone-200/85 flex items-center gap-3", children: [_jsx("div", { className: "flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-stone-800 to-stone-700 text-white shadow-sm", children: _jsx(FolderDot, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-base font-bold tracking-tight text-stone-900 font-outfit", children: "Orbit" }), _jsx("span", { className: "text-[9px] text-stone-500 tracking-wider font-mono", children: "FOUNDER COMPANION" })] })] }), _jsxs("div", { className: "p-4 border-b border-stone-200/85", children: [_jsx("label", { className: "block text-[9px] text-stone-500 uppercase tracking-widest mb-1.5 font-mono", children: "Workspace" }), _jsxs("select", { value: workspaceId, onChange: (e) => setWorkspaceId(e.target.value), className: "w-full px-2.5 py-1.5 text-xs text-stone-800 rounded-lg bg-white border border-stone-200 focus:outline-none focus:border-[#8c6d3b]", children: [_jsx("option", { value: "default-workspace", children: "Acme Analytics (Active)" }), _jsx("option", { value: "workspace-2", children: "Delta Delivery (Stage: GTM)" })] })] }), _jsxs("nav", { className: "flex-1 overflow-y-auto p-4 flex flex-col gap-5", children: [_jsxs("div", { children: [_jsx("span", { className: "block text-[9px] text-stone-500 uppercase tracking-widest font-mono mb-2", children: "Core Dashboard" }), _jsxs("button", { onClick: () => setActiveView('overview'), className: `w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${activeView === 'overview'
                                            ? 'bg-[#8c6d3b]/10 text-[#8c6d3b] border border-[#8c6d3b]/15 font-semibold shadow-[0_2px_10px_rgba(140,109,59,0.04)]'
                                            : 'text-stone-600 hover:text-stone-800 hover:bg-[#8c6d3b]/5'}`, children: [_jsx(LayoutDashboard, { className: "w-4 h-4" }), _jsx("span", { children: "Mission Control" })] })] }), _jsxs("div", { children: [_jsx("span", { className: "block text-[9px] text-stone-500 uppercase tracking-widest font-mono mb-2", children: "AI Departments" }), _jsx("div", { className: "flex flex-col gap-1", children: departmentsList.map((dept, index) => {
                                            const status = getDeptStatus(dept.name);
                                            const isSelected = activeView === dept.name;
                                            const unlocked = isDeptUnlocked(dept.name);
                                            return (_jsxs("button", { onClick: () => unlocked && setActiveView(dept.name), disabled: !unlocked, className: `w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition ${isSelected
                                                    ? 'bg-[#8c6d3b]/10 text-[#8c6d3b] border border-[#8c6d3b]/15 font-semibold'
                                                    : unlocked
                                                        ? 'text-stone-600 hover:text-stone-800 hover:bg-[#8c6d3b]/5'
                                                        : 'text-stone-400 opacity-40 cursor-not-allowed'}`, children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [unlocked ? (_jsx(dept.icon, { className: `w-3.5 h-3.5 ${isSelected ? 'text-[#8c6d3b]' : 'text-stone-500'}` })) : (_jsx(Lock, { className: "w-3.5 h-3.5 text-stone-400" })), _jsx("span", { children: dept.name })] }), unlocked && status === 'inprogress' && (_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#8c6d3b] animate-pulse" }))] }, index));
                                        }) })] })] }), _jsxs("div", { className: "p-4 border-t border-stone-200/80 bg-[#fbfaf7]/60 text-[9px] font-mono text-stone-500 flex flex-col gap-1.5", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }), _jsx("span", { children: "GEMMA SECURE CORE: ACTIVE" })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }), _jsx("span", { children: "GEMINI AGENT SYSTEM: ACTIVE" })] })] })] }), _jsxs("div", { className: "flex-1 flex flex-col min-w-0 z-10", children: [_jsxs("header", { className: "sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-stone-200/80 bg-[#f6f4ee]/80 backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("h2", { className: "text-sm font-semibold tracking-tight font-outfit text-stone-800", children: activeView === 'overview' ? 'Mission Control Hub' : `${activeView} Department Profile` }), _jsxs("span", { className: "text-[10px] text-[#8c6d3b] px-2 py-0.5 bg-[#8c6d3b]/5 rounded border border-[#8c6d3b]/15 font-mono", children: ["STAGE: ", context?.business.stage.toUpperCase() || 'RESEARCH'] })] }), _jsxs("div", { className: "flex items-center gap-4 text-xs", children: [_jsx("span", { className: "text-stone-500", children: "Startup Name:" }), _jsx("span", { className: "font-bold text-stone-850 bg-white px-2.5 py-1 rounded-lg border border-stone-200", children: context?.companyName || 'Acme Analytics' })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-6", children: activeView === 'overview' ? (
                        /* MISSION CONTROL GENERAL OVERVIEW */
                        _jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-4 gap-6", children: [_jsxs("div", { className: "xl:col-span-1 flex flex-col gap-6", children: [_jsxs("div", { className: "glass-panel rounded-2xl p-5 shadow-sm bg-white/70", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Zap, { className: "w-5 h-5 text-[#8c6d3b]" }), _jsx("h3", { className: "font-semibold text-stone-800 font-outfit", children: "Mission Control" })] }), _jsxs("form", { onSubmit: handleLaunch, className: "flex flex-col gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[10px] text-stone-500 uppercase tracking-wider mb-1.5 font-mono", children: "Founder Vision Statement" }), _jsx("textarea", { value: objective, onChange: (e) => setObjective(e.target.value), placeholder: "Describe your product idea... (e.g. 'Build an automated CRM system for organic farms')", className: "w-full h-28 p-3 text-xs text-stone-800 rounded-xl bg-[#faf9f6] border border-stone-200 focus:outline-none focus:border-[#8c6d3b] placeholder:text-stone-400 resize-none font-sans" })] }), _jsxs("button", { type: "submit", className: "w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-stone-800 to-stone-700 hover:from-stone-900 hover:to-stone-800 rounded-xl transition duration-200 shadow-sm", children: [_jsx(Play, { className: "w-4 h-4 fill-current" }), _jsx("span", { children: "Launch AI Company" })] })] })] }), _jsxs("div", { className: "glass-panel rounded-2xl p-5 shadow-sm bg-white/70", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(FileLock2, { className: "w-5 h-5 text-stone-700" }), _jsx("h3", { className: "font-semibold text-stone-800 font-outfit", children: "Gemma Secure Vault" })] }), _jsx("p", { className: "text-[11px] text-stone-500 mb-4 leading-relaxed", children: "Inputs saved here are local. Only derived calculations leave Gemma." }), _jsxs("form", { onSubmit: handleVaultSubmit, className: "flex flex-col gap-3 mb-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("select", { value: vaultKeyType, onChange: (e) => setVaultKeyType(e.target.value), className: "px-2 py-1 text-[11px] text-stone-700 rounded bg-white border border-stone-200", children: [_jsx("option", { value: "bank_account", children: "Bank Token" }), _jsx("option", { value: "api_credential", children: "OAuth Secret" }), _jsx("option", { value: "passport", children: "Identity Doc" })] }), _jsx("input", { type: "password", value: vaultPayload, onChange: (e) => setVaultPayload(e.target.value), placeholder: "Enter secret...", className: "px-2 py-1 text-[11px] text-stone-800 rounded bg-white border border-stone-200 focus:outline-none focus:border-[#8c6d3b]" })] }), _jsx("button", { type: "submit", className: "w-full py-1.5 text-[11px] font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded", children: "Save Secure Key" })] }), _jsx("div", { className: "max-h-36 overflow-y-auto flex flex-col gap-2", children: vaultEntries.length === 0 ? (_jsx("p", { className: "text-[10px] text-stone-400 italic", children: "No credentials logged." })) : (vaultEntries.map((e, idx) => (_jsxs("div", { className: "flex items-center justify-between p-2 rounded bg-stone-50 border border-stone-200 text-[10px]", children: [_jsx("span", { className: "font-mono text-[#8c6d3b]", children: e.key_type }), _jsx("span", { className: "text-stone-500", children: "Securely Vaulted" })] }, idx)))) })] })] }), _jsxs("div", { className: "xl:col-span-2 flex flex-col gap-6", children: [_jsxs("div", { className: "glass-panel rounded-2xl p-5 shadow-sm bg-white/70", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Users, { className: "w-5 h-5 text-stone-700" }), _jsx("h3", { className: "font-semibold text-stone-800 font-outfit", children: "AI Department Organization" })] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: departmentsList.map((dept, idx) => {
                                                        const status = getDeptStatus(dept.name);
                                                        const unlocked = isDeptUnlocked(dept.name);
                                                        return (_jsxs("div", { onClick: () => unlocked && setActiveView(dept.name), className: `cursor-pointer group flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${!unlocked
                                                                ? 'border-stone-200/40 bg-stone-200/10 opacity-30 cursor-not-allowed'
                                                                : status === 'inprogress'
                                                                    ? 'border-[#8c6d3b]/40 bg-[#8c6d3b]/5 shadow-[0_2px_15px_rgba(140,109,59,0.06)]'
                                                                    : status === 'completed'
                                                                        ? 'border-emerald-250 bg-emerald-50/20'
                                                                        : 'border-stone-200 bg-white hover:border-stone-300'}`, children: [_jsx("div", { className: `p-2 rounded-lg bg-gradient-to-br ${dept.color} text-[#f6f4ee] mb-2`, children: unlocked ? _jsx(dept.icon, { className: "w-4 h-4" }) : _jsx(Lock, { className: "w-4 h-4 text-stone-400" }) }), _jsx("span", { className: "text-xs font-medium text-stone-700 group-hover:text-[#8c6d3b] transition", children: dept.name }), _jsx("span", { className: `text-[9px] uppercase mt-1 px-1.5 py-0.5 rounded font-mono ${getStatusBadgeClass(status)}`, children: unlocked ? status : 'locked' })] }, idx));
                                                    }) })] }), _jsxs("div", { className: "glass-panel rounded-2xl p-5 shadow-sm bg-white/70", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Clock, { className: "w-5 h-5 text-emerald-700" }), _jsx("h3", { className: "font-semibold text-stone-800 font-outfit", children: "Active Execution Graph" })] }), _jsx("div", { className: "flex flex-col gap-3", children: tasks.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-6 text-stone-500 text-xs italic", children: [_jsx(Activity, { className: "w-8 h-8 mb-2 opacity-30 animate-spin" }), _jsx("span", { children: "No active tasks. Describe your vision to launch Orbit." })] })) : (tasks.map((task, idx) => (_jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200 text-xs", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: `w-2 h-2 rounded-full ${task.status === 'inprogress' ? 'bg-[#8c6d3b]' : task.status === 'completed' ? 'bg-emerald-600' : 'bg-stone-400'}` }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-stone-800", children: task.title }), _jsxs("span", { className: "text-[10px] text-stone-500 font-mono", children: ["Dept: ", task.department, " | Impact: $", task.costImpact] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "text-[10px] font-mono text-stone-500", children: ["Confidence: ", task.confidenceScore, "%"] }), _jsx("span", { className: `px-2 py-0.5 rounded text-[10px] font-mono uppercase ${getStatusBadgeClass(task.status)}`, children: task.status })] })] }, idx)))) })] })] }), _jsxs("div", { className: "xl:col-span-1 flex flex-col gap-6", children: [_jsxs("div", { className: "glass-panel rounded-2xl p-5 shadow-sm h-[320px] flex flex-col bg-white/70", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3 shrink-0", children: [_jsx(Activity, { className: "w-5 h-5 text-[#8c6d3b]" }), _jsx("h3", { className: "font-semibold text-stone-800 font-outfit", children: "Agent Pub/Sub Logs" })] }), _jsx("div", { className: "flex-grow overflow-y-auto flex flex-col gap-3 pr-1", children: logs.length === 0 ? (_jsx("p", { className: "text-xs text-stone-400 italic", children: "No communication logs." })) : (logs.map((log, idx) => (_jsxs("div", { className: "p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-[11px] font-sans", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "font-bold text-[#8c6d3b] uppercase tracking-wider text-[10px]", children: log.sender }), _jsx("span", { className: "text-[9px] text-stone-400 font-mono", children: log.action })] }), _jsx("p", { className: "text-stone-600 leading-snug", children: log.payload.title || JSON.stringify(log.payload) })] }, idx)))) })] }), _jsxs("div", { className: "glass-panel rounded-2xl p-5 shadow-sm h-[280px] flex flex-col bg-white/80 border-stone-200", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3 shrink-0", children: [_jsx(Terminal, { className: "w-5 h-5 text-stone-750" }), _jsx("h3", { className: "font-semibold text-stone-800 font-outfit", children: "Developer Console" })] }), _jsx("div", { className: "flex-grow overflow-y-auto bg-stone-900 rounded-xl p-3 border border-stone-850 font-mono text-[10px] text-stone-200 flex flex-col gap-1.5 scrollbar-thin", children: context?.technical.buildLogs.length === 0 ? (_jsx("span", { className: "text-stone-500 italic", children: "No build output. Ready to assemble." })) : (context?.technical.buildLogs.map((logLine, idx) => (_jsx("div", { className: "leading-relaxed border-l border-stone-500/20 pl-2", children: logLine }, idx)))) })] })] }), _jsxs("div", { className: "xl:col-span-4 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6", children: [_jsxs("div", { className: "glass-panel rounded-2xl p-5 shadow-sm bg-white/70", children: [_jsx("div", { className: "flex items-center justify-between mb-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-[#8c6d3b]" }), _jsx("h3", { className: "font-semibold text-stone-800 font-outfit", children: "Financial Projections" })] }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { className: "p-3 rounded-xl bg-[#faf9f6] border border-stone-200", children: [_jsx("span", { className: "text-[10px] text-stone-500 block uppercase", children: "Cash Runway" }), _jsxs("span", { className: "text-xl font-bold font-outfit text-[#8c6d3b]", children: [context?.financials.runwayMonths || 12, " Months"] })] }), _jsxs("div", { className: "p-3 rounded-xl bg-[#faf9f6] border border-stone-200", children: [_jsx("span", { className: "text-[10px] text-stone-500 block uppercase", children: "Monthly Burn" }), _jsxs("span", { className: "text-xl font-bold font-outfit text-stone-700", children: ["$", context?.financials.burnRate || 1500] })] })] }), _jsxs("div", { className: "flex flex-col gap-2 text-xs", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-stone-500", children: "Stitch Cloud Infra:" }), _jsxs("span", { className: "text-stone-700", children: ["$", context?.financials.infrastructureCost || 150] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-stone-500", children: "Gemini/Gemma Subscriptions:" }), _jsxs("span", { className: "text-stone-700", children: ["$", context?.financials.subscriptionCost || 80] })] })] })] }), _jsxs("div", { className: "glass-panel rounded-2xl p-5 shadow-sm bg-white/70 col-span-1 lg:col-span-2", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-[#8c6d3b] animate-pulse" }), _jsx("h3", { className: "font-semibold text-stone-800 font-outfit", children: "Conflict Resolution Center" })] }), _jsx("div", { className: "flex flex-col gap-3", children: conflicts.length === 0 ? (_jsx("p", { className: "text-xs text-stone-400 italic py-4", children: "No disputes detected between agents. Continuous loop running smoothly." })) : (conflicts.map((conflict, idx) => (_jsxs("div", { className: "p-3.5 rounded-xl border border-[#8c6d3b]/20 bg-[#8c6d3b]/5 text-xs", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-bold text-[#8c6d3b] font-outfit", children: conflict.topic }), _jsx("span", { className: `px-2 py-0.5 rounded text-[9px] font-mono uppercase ${conflict.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-[#8c6d3b]/10 text-[#8c6d3b]'}`, children: conflict.status })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-3", children: [_jsxs("div", { className: "p-2.5 rounded bg-white border border-stone-200", children: [_jsxs("span", { className: "font-bold text-stone-500 text-[10px] uppercase block mb-1", children: [conflict.partyA, " Argument"] }), _jsx("p", { className: "text-stone-600 leading-relaxed text-[11px]", children: conflict.argumentsA })] }), _jsxs("div", { className: "p-2.5 rounded bg-white border border-stone-200", children: [_jsxs("span", { className: "font-bold text-stone-500 text-[10px] uppercase block mb-1", children: [conflict.partyB, " Argument"] }), _jsx("p", { className: "text-stone-600 leading-relaxed text-[11px]", children: conflict.argumentsB })] })] }), conflict.status === 'active' ? (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleConflictResolve(conflict.id, `Approved argument by ${conflict.partyA}`), className: "px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-50 rounded text-[11px]", children: "Approve Legal GDPR Rule" }), _jsx("button", { onClick: () => handleConflictResolve(conflict.id, `Approved argument by ${conflict.partyB}`), className: "px-3 py-1.5 bg-[#8c6d3b] text-white hover:bg-[#70552b] font-semibold rounded text-[11px]", children: "Approve GTM Fast Signup" })] })) : (_jsxs("div", { className: "text-[11px] text-stone-500 italic mt-1.5 border-t border-stone-200 pt-1.5", children: [_jsx("strong", { children: "Resolution:" }), " ", conflict.resolution] }))] }, idx)))) })] })] })] })) : (
                        /* INDIVIDUAL DEPARTMENT VIEWS (CHATBOT + SPECIALIZED WIDGETS) */
                        /* REDESIGNED CHATBOT: WIDER AND MORE SPACIOUS (65% width vs 35% width for widgets) */
                        _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]", children: [_jsxs("div", { className: "lg:col-span-8 glass-panel rounded-2xl p-5 shadow-2xl flex flex-col h-[600px] bg-white/70 border-stone-200/70", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-stone-200/80 pb-4 mb-4 shrink-0", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2.5 rounded-xl bg-gradient-to-tr from-stone-800 to-stone-700 text-white shadow-[0_2px_10px_rgba(140,109,59,0.1)]", children: _jsx(MessageSquare, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsxs("h3", { className: "font-bold text-stone-900 font-outfit text-sm tracking-wide", children: [activeView, " Agent"] }), _jsx("span", { className: "text-[9px] text-[#8c6d3b] font-mono tracking-widest uppercase font-bold", children: "Autonomous Context Memory active" })] })] }), _jsx("button", { onClick: handleCompleteDepartment, disabled: isCompletingStage, className: "flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-[#8c6d3b] hover:bg-[#70552b] rounded-lg transition disabled:opacity-50", children: isCompletingStage ? (_jsx("span", { children: "Unlocking..." })) : (_jsxs(_Fragment, { children: [_jsx(Check, { className: "w-3.5 h-3.5 stroke-[3]" }), _jsx("span", { children: "Complete Department & Unlock Next" })] })) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto flex flex-col gap-4 pr-2 mb-4 scrollbar-thin", children: [(chatHistories[activeView] || []).map((msg, idx) => (_jsxs("div", { className: `flex flex-col max-w-[90%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`, children: [_jsx("span", { className: "text-[9px] text-stone-500 mb-1 font-mono", children: msg.timestamp }), _jsx("div", { className: `p-3.5 rounded-2xl text-xs leading-relaxed font-sans shadow-sm border ${msg.sender === 'user'
                                                                ? 'bg-[#8c6d3b]/10 text-stone-850 border-[#8c6d3b]/20'
                                                                : 'bg-[#faf9f6]/95 text-stone-800 border-stone-200'}`, children: msg.text.split('\n').map((line, lIdx) => {
                                                                if (line.startsWith('### ')) {
                                                                    return _jsx("h4", { className: "font-bold text-stone-950 text-xs mb-1.5 mt-2 font-outfit", children: line.replace('### ', '') }, lIdx);
                                                                }
                                                                if (line.startsWith('- ')) {
                                                                    return _jsx("li", { className: "list-disc list-inside ml-2 text-stone-600 my-0.5", children: line.replace('- ', '') }, lIdx);
                                                                }
                                                                return _jsx("p", { className: "my-0.5", children: line }, lIdx);
                                                            }) })] }, idx))), isChatLoading && (_jsxs("div", { className: "self-start items-start max-w-[90%] flex flex-col", children: [_jsx("span", { className: "text-[9px] text-stone-500 mb-1 font-mono", children: "Thinking..." }), _jsx("div", { className: "p-3.5 rounded-2xl text-xs bg-stone-100 text-stone-500 border border-stone-200 animate-pulse", children: "Analyzing active startup context engine log..." })] })), _jsx("div", { ref: chatEndRef })] }), _jsxs("form", { onSubmit: handleChatSubmit, className: "flex gap-2.5 shrink-0 border-t border-stone-200/80 pt-3", children: [_jsx("input", { type: "text", value: chatInput, onChange: (e) => setChatInput(e.target.value), placeholder: `Submit context update or ask ${activeView} agent...`, className: "flex-1 px-4 py-2.5 text-xs text-stone-800 rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-[#8c6d3b] placeholder:text-stone-400" }), _jsx("button", { type: "submit", className: "p-2.5 bg-gradient-to-tr from-stone-800 to-stone-700 hover:from-stone-900 hover:to-stone-800 text-white rounded-xl transition shadow-sm", children: _jsx(Send, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "lg:col-span-4 flex flex-col gap-6", children: [activeView === 'Research' && (_jsxs("div", { className: "glass-panel rounded-2xl p-5 shadow-sm flex flex-col gap-5 bg-white/70 border-stone-200/70", children: [_jsxs("div", { className: "flex items-center gap-2 border-b border-stone-200/80 pb-3", children: [_jsx(Sparkles, { className: "w-4.5 h-4.5 text-[#8c6d3b]" }), _jsx("h3", { className: "font-bold text-stone-900 font-outfit text-sm", children: "Dynamic Opportunity Matrix" })] }), _jsxs("div", { className: "grid grid-cols-1 gap-3", children: [_jsxs("div", { className: "p-3.5 rounded-xl bg-[#faf9f6] border border-stone-200", children: [_jsx("span", { className: "text-[10px] text-stone-500 block uppercase mb-1 font-mono", children: "Total Addressable Market (TAM)" }), _jsx("span", { className: "text-xl font-bold text-[#8c6d3b] font-outfit tracking-tight", children: context?.business.tam || '$4.5 Billion' })] }), _jsxs("div", { className: "p-3.5 rounded-xl bg-[#faf9f6] border border-stone-200", children: [_jsx("span", { className: "text-[10px] text-stone-500 block uppercase mb-1 font-mono", children: "Serviceable Addressable Market (SAM)" }), _jsx("span", { className: "text-xl font-bold text-stone-700 font-outfit tracking-tight", children: context?.business.sam || '$820 Million' })] })] }), _jsxs("div", { className: "border border-stone-200 rounded-xl p-3 bg-[#faf9f6] text-xs", children: [_jsx("h4", { className: "font-semibold text-stone-800 mb-2 font-outfit", children: "Dynamic SWOT analysis" }), _jsxs("div", { className: "flex flex-col gap-1 text-stone-600 font-mono text-[10px]", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-3.5 h-3.5 text-emerald-600 shrink-0" }), _jsxs("span", { children: ["Niche: ", context?.business.niche] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-3.5 h-3.5 text-emerald-600 shrink-0" }), _jsxs("span", { children: ["Target: ", context?.business.targetMarket] })] })] })] })] })), activeView === 'Validation' && (_jsxs("div", { className: "glass-panel rounded-2xl p-5 shadow-sm flex flex-col gap-5 bg-white/70 border-stone-200/70", children: [_jsxs("div", { className: "flex items-center gap-2 border-b border-stone-200/80 pb-3", children: [_jsx(SlidersHorizontal, { className: "w-4.5 h-4.5 text-[#8c6d3b]" }), _jsx("h3", { className: "font-bold text-stone-900 font-outfit text-sm", children: "Financial Setup Questionnaire" })] }), _jsxs("form", { onSubmit: handleSaveValidationInputs, className: "flex flex-col gap-3.5", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[10px] text-stone-600 font-mono uppercase tracking-wider mb-1", children: "Startup Target Budget" }), _jsx("input", { type: "text", value: validationBudget, onChange: (e) => setValidationBudget(e.target.value), placeholder: "e.g. \u20B93 Lakhs or $10,000", className: "w-full px-3 py-2 text-xs text-stone-800 rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-[#8c6d3b]", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] text-stone-600 font-mono uppercase tracking-wider mb-1", children: "What exactly are you building?" }), _jsx("textarea", { value: validationIdeaText, onChange: (e) => setValidationIdeaText(e.target.value), placeholder: "e.g. A lightweight offline agronomy journal app", className: "w-full h-16 p-2 text-xs text-stone-800 rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-[#8c6d3b] resize-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] text-stone-600 font-mono uppercase tracking-wider mb-1", children: "Financial Stage" }), _jsxs("select", { value: validationFinStage, onChange: (e) => setValidationFinStage(e.target.value), className: "w-full px-3 py-2 text-xs text-stone-700 rounded-xl bg-white border border-stone-200 focus:outline-none", children: [_jsx("option", { value: "Bootstrapped", children: "Bootstrapped / Self-Funded" }), _jsx("option", { value: "Pre-Seed", children: "Pre-Seed round" }), _jsx("option", { value: "Seed-Funded", children: "Seed VC investment" })] })] }), _jsx("button", { type: "submit", disabled: isSavingValidationInputs, className: "w-full py-2.5 text-xs font-bold text-white bg-[#8c6d3b] hover:bg-[#70552b] rounded-xl transition shadow-sm", children: isSavingValidationInputs ? 'Saving Details...' : 'Save Financial Inputs & Validate' })] })] })), activeView === 'Brand' && (_jsxs("div", { className: "glass-panel rounded-2xl p-5 shadow-2xl flex flex-col gap-5 bg-white/70 border-stone-200/70", children: [_jsxs("div", { className: "flex items-center gap-2 border-b border-stone-200/80 pb-3", children: [_jsx(Palette, { className: "w-4.5 h-4.5 text-[#8c6d3b]" }), _jsx("h3", { className: "font-bold text-stone-900 font-outfit text-sm", children: "Sales Pitch Deck" })] }), !isDeckGenerated ? (_jsxs("button", { onClick: generatePitchDeck, className: "w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-white bg-[#8c6d3b] hover:bg-[#70552b] rounded-xl transition shadow-sm", children: [_jsx(FileText, { className: "w-4 h-4" }), _jsx("span", { children: "Generate Sales Pitch Deck" })] })) : (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "p-4 rounded-xl border border-[#8c6d3b]/20 bg-[#faf9f6] min-h-[140px] flex flex-col justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: "text-[9px] text-[#8c6d3b] uppercase font-mono tracking-widest", children: pitchSlides[activeSlideIdx].title }), _jsxs("span", { className: "text-[9px] text-stone-500 font-mono", children: [activeSlideIdx + 1, " / 5"] })] }), _jsx("h4", { className: "text-xs font-bold text-stone-900 font-outfit mb-1", children: pitchSlides[activeSlideIdx].header }), _jsxs("p", { className: "text-[11px] text-stone-600 leading-relaxed italic", children: ["\"", pitchSlides[activeSlideIdx].body, "\""] })] }), _jsxs("div", { className: "flex items-center justify-between mt-3 pt-2 border-t border-stone-200/50", children: [_jsx("button", { onClick: () => handleSlideSelect(Math.max(0, activeSlideIdx - 1)), disabled: activeSlideIdx === 0, className: "p-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-30", children: _jsx(ChevronLeft, { className: "w-3.5 h-3.5 text-stone-700" }) }), _jsx("span", { className: "text-[10px] text-stone-500", children: "Edit slide text below" }), _jsx("button", { onClick: () => handleSlideSelect(Math.min(4, activeSlideIdx + 1)), disabled: activeSlideIdx === 4, className: "p-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-30", children: _jsx(ChevronRight, { className: "w-3.5 h-3.5 text-stone-700" }) })] })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-[10px] text-stone-500 uppercase font-mono", children: "Edit Text Content" }), _jsx("textarea", { value: slideEditingText, onChange: (e) => setSlideEditingText(e.target.value), className: "w-full h-20 p-2.5 text-xs text-stone-850 rounded-lg bg-white border border-stone-250 focus:outline-none focus:border-[#8c6d3b] resize-none font-sans" }), _jsxs("button", { onClick: handleSaveSlideText, className: "flex items-center justify-center gap-1.5 py-1.5 text-xs text-stone-700 bg-stone-100 border border-stone-300 hover:bg-stone-200 rounded-lg", children: [_jsx(Save, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Save Slide Context" })] }), showSavedNotification && (_jsxs("span", { className: "text-[10px] text-emerald-600 font-mono text-center flex items-center justify-center gap-1", children: [_jsx(Check, { className: "w-3 h-3 text-emerald-600" }), "Saved to Context Engine!"] }))] })] }))] })), activeView === 'Finance' && (_jsxs("div", { className: "glass-panel rounded-2xl p-5 shadow-sm flex flex-col gap-5 bg-white/70 border-stone-200/70", children: [_jsx("div", { className: "flex items-center justify-between border-b border-stone-200/80 pb-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(DollarSign, { className: "w-4.5 h-4.5 text-[#8c6d3b]" }), _jsx("h3", { className: "font-bold text-stone-900 font-outfit text-sm", children: "CFO Spreadsheet Room" })] }) }), _jsx("div", { className: "flex flex-col gap-2", children: _jsxs("a", { href: `/api/finance/excel?workspaceId=${workspaceId}`, download: true, className: "w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-white bg-[#8c6d3b] hover:bg-[#70552b] rounded-xl transition shadow-sm text-center", children: [_jsx(Download, { className: "w-4 h-4" }), _jsx("span", { children: "Download Financial Sheet (Excel)" })] }) }), _jsxs("div", { className: "border-t border-stone-200/80 pt-4 flex flex-col gap-3", children: [_jsxs("h4", { className: "font-bold text-stone-900 font-outfit text-xs flex items-center gap-1.5", children: [_jsx(SlidersHorizontal, { className: "w-4 h-4 text-[#8c6d3b]" }), _jsx("span", { children: "Refine Budget via AI" })] }), _jsxs("form", { onSubmit: handleRefineBudget, className: "flex flex-col gap-2", children: [_jsx("textarea", { value: budgetRefinePrompt, onChange: (e) => setBudgetRefinePrompt(e.target.value), placeholder: "e.g. Cut cloud infra by 50% and allocate to sales outreach...", className: "w-full h-16 p-2 text-xs text-stone-850 rounded-xl bg-white border border-stone-250 focus:outline-none focus:border-[#8c6d3b] resize-none", required: true }), _jsx("button", { type: "submit", disabled: isRefiningBudget, className: "w-full py-1.5 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition", children: isRefiningBudget ? 'Refining model data...' : 'Refine Budget' })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs pt-2", children: [_jsxs("div", { className: "p-3 rounded-xl bg-[#faf9f6] border border-stone-200 text-center", children: [_jsx("span", { className: "text-[10px] text-stone-500 block uppercase mb-1", children: "Burn Rate" }), _jsxs("span", { className: "text-base font-bold text-stone-800 font-mono", children: ["$", context?.financials.burnRate, "/mo"] })] }), _jsxs("div", { className: "p-3 rounded-xl bg-[#faf9f6] border border-stone-200 text-center", children: [_jsx("span", { className: "text-[10px] text-stone-500 block uppercase mb-1", children: "Infrastructure" }), _jsxs("span", { className: "text-base font-bold text-stone-850 font-mono", children: ["$", context?.financials.infrastructureCost, "/mo"] })] })] })] })), (activeView === 'Marketing' || activeView === 'Sales') && (_jsxs("div", { className: "glass-panel rounded-2xl p-5 shadow-2xl flex flex-col gap-5 bg-white/70 border-stone-200/70", children: [_jsxs("div", { className: "flex items-center gap-2 border-b border-stone-200/80 pb-3", children: [_jsx(Image, { className: "w-4.5 h-4.5 text-[#8c6d3b]" }), _jsx("h3", { className: "font-bold text-stone-900 font-outfit text-sm", children: "Nano Banana Engine" })] }), _jsxs("button", { onClick: triggerNanoBanana, disabled: isGeneratingBanana, className: "w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-white bg-gradient-to-r from-stone-800 to-stone-700 hover:from-stone-900 hover:to-stone-800 rounded-xl transition shadow-sm disabled:opacity-50", children: [_jsx(Image, { className: "w-4 h-4" }), _jsx("span", { children: isGeneratingBanana ? 'Generating...' : 'Generate via Nano Banana' })] }), bananaImages.length > 0 && (_jsxs("div", { className: "flex flex-col gap-2 max-h-48 overflow-y-auto pr-1", children: [_jsx("span", { className: "text-[9px] text-stone-500 uppercase font-mono", children: "Generated Assets" }), bananaImages.map((img, idx) => (_jsxs("div", { className: "p-2.5 rounded-lg border border-stone-200 bg-[#faf9f6] text-xs", children: [_jsx("span", { className: "font-bold text-[#8c6d3b] text-[10px] uppercase font-mono block mb-1", children: img.type }), _jsxs("p", { className: "text-[11px] text-stone-600 italic", children: ["\"", img.prompt, "\""] })] }, idx)))] })), activeView === 'Marketing' && (_jsxs("div", { className: "border-t border-stone-200/80 pt-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Instagram, { className: "w-4.5 h-4.5 text-pink-700" }), _jsx("h4", { className: "font-bold text-stone-800 font-outfit text-xs", children: "Instagram Automation" })] }), instaStatus === 'disconnected' ? (_jsxs("form", { onSubmit: handleConnectInsta, className: "flex gap-2", children: [_jsx("input", { type: "text", value: instaUsername, onChange: (e) => setInstaUsername(e.target.value), placeholder: "Insta Username", className: "flex-1 px-2.5 py-1.5 text-xs text-stone-800 rounded-lg bg-white border border-stone-200 focus:outline-none focus:border-[#8c6d3b]" }), _jsx("button", { type: "submit", className: "px-3 py-1.5 text-xs font-bold text-stone-750 bg-stone-100 border border-stone-300 hover:bg-stone-200 rounded-lg", children: "Link" })] })) : instaStatus === 'connecting' ? (_jsx("div", { className: "text-xs text-stone-500 italic animate-pulse", children: "Connecting to instagram API..." })) : (_jsxs("div", { className: "p-2.5 rounded-lg border border-emerald-250 bg-emerald-50/20 text-xs flex items-center justify-between", children: [_jsxs("span", { className: "text-stone-850 font-semibold text-[10px]", children: ["@", instaUsername, " connected"] }), _jsxs("span", { className: "text-[9px] text-emerald-800 font-mono flex items-center gap-1 font-bold", children: [_jsx(CheckCircle, { className: "w-3 h-3 fill-current text-emerald-600" }), "Active"] })] }))] }))] })), activeView === 'Engineering' && (_jsxs("div", { className: "glass-panel rounded-2xl p-5 shadow-sm flex flex-col gap-4 bg-white/70 border-stone-200/70", children: [_jsxs("div", { className: "flex items-center gap-2 border-b border-stone-200/80 pb-3", children: [_jsx(Code, { className: "w-4.5 h-4.5 text-[#8c6d3b]" }), _jsx("h3", { className: "font-bold text-stone-900 font-outfit text-sm", children: "Repository Status" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [_jsxs("div", { className: "p-3 rounded-xl bg-[#faf9f6] border border-stone-200", children: [_jsx("span", { className: "text-stone-500 block text-[9px] uppercase", children: "Active Repo" }), _jsx("span", { className: "font-mono text-stone-800", children: "git-worktree/orbit-monorepo" })] }), _jsxs("div", { className: "p-3 rounded-xl bg-[#faf9f6] border border-stone-200", children: [_jsx("span", { className: "text-stone-500 block text-[9px] uppercase", children: "Build status" }), _jsx("span", { className: "font-mono text-emerald-850 font-bold uppercase", children: context?.technical.buildStatus })] })] })] })), ['Research', 'Validation', 'Brand', 'Marketing', 'Sales', 'Finance', 'Engineering'].indexOf(activeView) === -1 && (_jsxs("div", { className: "glass-panel rounded-2xl p-5 shadow-sm flex flex-col gap-4 bg-white/70 border-stone-200/70", children: [_jsxs("div", { className: "flex items-center gap-2 border-b border-stone-200/85 pb-3", children: [_jsx(Cpu, { className: "w-4.5 h-4.5 text-[#8c6d3b]" }), _jsxs("h3", { className: "font-bold text-stone-900 font-outfit text-sm", children: [activeView, " Workspace Board"] })] }), _jsxs("p", { className: "text-xs text-stone-600 leading-relaxed", children: ["This board displays live assets, document logs, and operational registers associated with the **", activeView, " Department** execution tasks."] }), _jsxs("div", { className: "p-4 rounded-xl border border-stone-200 bg-[#faf9f6] text-xs flex flex-col gap-2 font-mono", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-stone-500", children: "Task Stage:" }), _jsx("span", { className: "text-stone-800", children: "Automated loop check passed" })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-stone-500", children: "Deliverable Status:" }), _jsx("span", { className: "text-emerald-700", children: "Synchronized with Context Engine" })] })] })] }))] })] })) })] })] }));
}
//# sourceMappingURL=App.js.map