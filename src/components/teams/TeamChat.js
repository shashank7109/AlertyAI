'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiAtSign, FiClock, FiUser } from 'react-icons/fi'
import { teamAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

export default function TeamChat({ teamId, currentUserId }) {
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState('')
    const [loading, setLoading] = useState(true)
    const [suggestions, setSuggestions] = useState([])
    const [showMentions, setShowMentions] = useState(false)
    const [mentionQuery, setMentionQuery] = useState('')
    const [cursorPos, setCursorPos] = useState(0)

    const wsRef = useRef(null)
    const scrollRef = useRef(null)
    const inputRef = useRef(null)

    // Fetch history and setup WebSocket
    useEffect(() => {
        if (!teamId) return

        const initChat = async () => {
            try {
                setLoading(true)
                // 1. Fetch History
                const historyRes = await teamAPI.getChatHistory(teamId)
                if (historyRes.data?.success) {
                    setMessages(historyRes.data.messages || [])
                }

                // 2. Fetch Member Suggestions for @mentions
                const memberRes = await teamAPI.getMentionSuggestions(teamId)
                if (memberRes.data?.success) {
                    setSuggestions(memberRes.data.members || [])
                }

                // 3. Connect WebSocket
                connectWS()
            } catch (err) {
                console.error('Chat init error:', err)
                // toast.error('Failed to connect to chat')
            } finally {
                setLoading(false)
            }
        }

        initChat()

        return () => {
            if (wsRef.current) wsRef.current.close()
        }
    }, [teamId])

    const connectWS = () => {
        const wsUrl = teamAPI.getChatWSUrl(teamId)
        const ws = new WebSocket(wsUrl)

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data)
                setMessages(prev => [...prev, msg])
            } catch (e) {
                console.error('WS Message error:', e)
            }
        }

        ws.onclose = () => {
            console.log('WS Disconnected. Retrying in 3s...')
            setTimeout(connectWS, 3000)
        }

        wsRef.current = ws
    }

    // Auto scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // Handle Input with @mention detection
    const handleInputChange = (e) => {
        const value = e.target.value
        const pos = e.target.selectionStart
        setInputText(value)
        setCursorPos(pos)

        // Detect @ symbol before cursor
        const lastAt = value.lastIndexOf('@', pos - 1)
        if (lastAt !== -1) {
            const query = value.slice(lastAt + 1, pos)
            if (!query.includes(' ')) {
                setMentionQuery(query.toLowerCase())
                setShowMentions(true)
                return
            }
        }
        setShowMentions(false)
    }

    const selectMention = (username) => {
        const lastAt = inputText.lastIndexOf('@', cursorPos - 1)
        const before = inputText.slice(0, lastAt)
        const after = inputText.slice(cursorPos)
        const newValue = `${before}@${username} ${after}`
        setInputText(newValue)
        setShowMentions(false)
        inputRef.current?.focus()
    }

    const sendMessage = (e) => {
        e.preventDefault()
        if (!inputText.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return

        const payload = { text: inputText.trim() }
        wsRef.current.send(JSON.stringify(payload))
        setInputText('')
        setShowMentions(false)
    }

    const filteredSuggestions = suggestions.filter(s =>
        s.username.toLowerCase().includes(mentionQuery) ||
        s.display_name.toLowerCase().includes(mentionQuery)
    )

    const formatTime = (ts) => {
        if (!ts) return ''
        const d = new Date(ts)
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="flex flex-col h-[600px] bg-surface dark:bg-background rounded-[2rem] overflow-hidden clay-card border-none">
            {/* Messages Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-xs tracking-widest uppercase text-text-secondary">Team Activity</h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">LIVE</span>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth hide-scrollbar"
            >
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50 italic">
                        <FiUser size={48} className="mb-4" />
                        <p className="text-sm font-black tracking-widest uppercase">Start the conversation</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.sender_id === currentUserId || msg.sender_email === localStorage.getItem('user_email')
                        return (
                            <motion.div
                                key={msg.id || idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex flex-col max-w-[80%]",
                                    isMe ? "ml-auto items-end" : "items-start"
                                )}
                            >
                                <div className="flex items-center gap-2 mb-1 px-2">
                                    <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">{isMe ? 'YOU' : msg.sender_name}</span>
                                    <span className="text-[10px] text-gray-300 font-bold uppercase">{formatTime(msg.timestamp)}</span>
                                </div>
                                <div className={cn(
                                    "px-5 py-3 rounded-2xl text-sm font-medium shadow-sm",
                                    isMe
                                        ? "bg-primary text-on-primary rounded-tr-none"
                                        : "bg-surface-hover/50 text-on-surface rounded-tl-none"
                                )}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        )
                    })
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 relative">
                <AnimatePresence>
                    {showMentions && filteredSuggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full left-4 mb-2 w-64 bg-surface dark:bg-zinc-900 rounded-2xl shadow-2xl border border-border overflow-hidden z-20"
                        >
                            <div className="px-4 py-2 bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Mention Member
                            </div>
                            {filteredSuggestions.map(user => (
                                <button
                                    key={user.user_id}
                                    onClick={() => selectMention(user.username)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xs">
                                        {user.display_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-800 dark:text-gray-100 italic">@{user.username}</div>
                                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{user.display_name}</div>
                                    </div>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={sendMessage} className="relative flex items-center gap-3">
                    <div className="relative flex-1">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={handleInputChange}
                            placeholder="Type a message..."
                            className="w-full pl-6 pr-12 py-4 bg-surface-hover/50 rounded-2xl text-[13px] font-medium focus:ring-2 focus:ring-primary outline-none transition-all inner-shadow border-none"
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                            <FiAtSign size={18} />
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        <FiSend size={20} />
                    </button>
                </form>
            </div>
        </div>
    )
}
