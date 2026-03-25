import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import { Megaphone, Plus, X, Globe, Users } from 'lucide-react';
import { toast } from 'sonner';
import * as teacherApi from '../../api/teacherApi';

const AnnouncementsPage = ({ dashboardStats, classesList }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('General'); // General, Assignment, Exam
    const [audience, setAudience] = useState('ALL'); // ALL, CLASS
    const [targetClassId, setTargetClassId] = useState(''); // Only if audience === 'CLASS'

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (dashboardStats?.teacherId) {
            fetchAnnouncements();
        }
    }, [dashboardStats]);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const data = await teacherApi.fetchAnnouncementsByTeacher(dashboardStats.teacherId);
            setAnnouncements(Array.isArray(data) ? data.reverse() : []);
        } catch (error) {
            toast.error("Failed to load announcements");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            toast.error("Title and content are required.");
            return;
        }

        if (audience === 'CLASS' && !targetClassId) {
            toast.error("Please select a target class.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                title,
                message: content,
                type,
                audience,
                targetClassId: audience === 'CLASS' ? parseInt(targetClassId) : null,
                isBroadcast: audience === 'ALL'
            };

            const res = await teacherApi.createAnnouncement(payload);

            if (res.success) {
                toast.success("Announcement broadcasted successfully");
                setShowForm(false);
                setTitle('');
                setContent('');
                setType('General');
                setAudience('ALL');
                setTargetClassId('');
                fetchAnnouncements();
            } else {
                toast.error("Failed to create announcement");
            }
        } catch (err) {
            toast.error("Network error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Announcements</h2>
                    <p className="text-sm text-gray-500 mt-1">Broadcast messages to all students or specific classes.</p>
                </div>
                {!showForm && (
                    <Button onClick={() => setShowForm(true)}>
                        <Plus className="h-4 w-4" />
                        New Announcement
                    </Button>
                )}
            </div>

            {showForm && (
                <Card className="border-indigo-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between bg-indigo-50/50 border-b border-indigo-50">
                        <CardTitle className="text-indigo-900">Create New Announcement</CardTitle>
                        <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-indigo-100 text-indigo-500">
                            <X className="h-5 w-5" />
                        </button>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Title"
                                    placeholder="e.g. Schedule Change for Tomorrow"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Type</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        disabled={isSubmitting}
                                    >
                                        <option value="General">General</option>
                                        <option value="Assignment">Assignment</option>
                                        <option value="Exam">Exam</option>
                                        <option value="Event">Event</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Audience</label>
                                <div className="flex gap-4 mb-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" value="ALL" checked={audience === 'ALL'} onChange={() => setAudience('ALL')} className="text-indigo-600 focus:ring-indigo-500" disabled={isSubmitting} />
                                        <span className="text-sm text-gray-700">All My Students</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" value="CLASS" checked={audience === 'CLASS'} onChange={() => setAudience('CLASS')} className="text-indigo-600 focus:ring-indigo-500" disabled={isSubmitting} />
                                        <span className="text-sm text-gray-700">Specific Class</span>
                                    </label>
                                </div>

                                {audience === 'CLASS' && (
                                    <select
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white mt-1"
                                        value={targetClassId}
                                        onChange={(e) => setTargetClassId(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    >
                                        <option value="" disabled>Select a target class...</option>
                                        {classesList && classesList.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} {c.stream ? `(${c.stream})` : ''}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <Textarea
                                label="Content"
                                placeholder="Write your announcement message here..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />

                            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                                <Button variant="secondary" type="button" onClick={() => setShowForm(false)} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Broadcasting...' : 'Broadcast Announcement'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2">Recent Announcements</h3>

                {loading ? (
                    <div className="py-12 text-center text-gray-500 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-3"></div>
                        Loading announcements...
                    </div>
                ) : announcements.length > 0 ? (
                    <div className="grid gap-4">
                        {announcements.map((ann) => (
                            <Card key={ann.id} className="hover:shadow-md transition-shadow">
                                <div className="p-5 flex gap-4 items-start">
                                    <div className={`p-3 rounded-xl flex-shrink-0 ${ann.audience === 'ALL' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                                        }`}>
                                        {ann.audience === 'ALL' ? <Globe className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-base font-bold text-gray-900 leading-tight">{ann.title}</h4>
                                            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap bg-gray-100 px-2 py-1 rounded">
                                                {new Date(ann.createdAt || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex gap-2 items-center mt-2 mb-3">
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-800 text-white px-2 py-0.5 rounded shadow-sm">
                                                {ann.type || 'General'}
                                            </span>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${ann.audience === 'ALL' ? 'border-indigo-200 text-indigo-700 bg-indigo-50' : 'border-emerald-200 text-emerald-700 bg-emerald-50'
                                                }`}>
                                                {ann.audience === 'ALL' ? 'Broadcast' : `Class ID: ${ann.targetClassId || ann.classId}`}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Megaphone className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No Announcements Yet</h3>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto">
                                Keep your students informed by broadcasting important updates, exam schedules, or general information.
                            </p>
                            {!showForm && (
                                <Button className="mt-6" onClick={() => setShowForm(true)}>
                                    Create Your First Announcement
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default AnnouncementsPage;
