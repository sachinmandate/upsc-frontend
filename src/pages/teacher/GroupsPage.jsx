import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Users, Plus, X, Search, UserPlus, UserMinus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import * as teacherApi from '../../api/teacherApi';

const GroupsPage = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);

    // Form state
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');

    // Student Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedGroupForStudents, setSelectedGroupForStudents] = useState(null);

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        setLoading(true);
        const data = await teacherApi.fetchMyGroups();
        setGroups(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    const handleCreateOrUpdateGroup = async (e) => {
        e.preventDefault();
        if (!groupName.trim()) return;

        const payload = { name: groupName, description: groupDescription };
        let res;
        if (editingGroup) {
            res = await teacherApi.updateGroup(editingGroup.id, payload);
        } else {
            res = await teacherApi.createGroup(payload);
        }

        if (res) {
            toast.success(`Group ${editingGroup ? 'updated' : 'created'} successfully`);
            setShowCreateModal(false);
            setEditingGroup(null);
            setGroupName('');
            setGroupDescription('');
            loadGroups();
        } else {
            toast.error("Operation failed");
        }
    };

    const handleDeleteGroup = async (id) => {
        if (!window.confirm("Are you sure you want to delete this group?")) return;
        const res = await teacherApi.deleteGroup(id);
        if (res.success) {
            toast.success("Group deleted");
            loadGroups();
        } else {
            toast.error("Failed to delete group");
        }
    };

    const handleSearchStudents = async () => {
        if (searchQuery.length < 2) return;
        setSearching(true);
        const results = await teacherApi.searchStudents(searchQuery);
        setSearchResults(results);
        setSearching(false);
    };

    const toggleStudentInGroup = async (student, group) => {
        const isInGroup = (group.students || []).some(s => s.id === student.id);
        let res;
        if (isInGroup) {
            res = await teacherApi.removeStudentFromGroup(group.id, student.id);
        } else {
            res = await teacherApi.addStudentToGroup(group.id, student.id);
        }

        if (res.success) {
            toast.success(`Student ${isInGroup ? 'removed' : 'added'} successfully`);
            loadGroups(); // Refresh groups to update student lists
        } else {
            toast.error("Action failed");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Student Groups</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage batches and subject-wise study groups.</p>
                </div>
                <Button onClick={() => { setEditingGroup(null); setGroupName(''); setGroupDescription(''); setShowCreateModal(true); }}>
                    <Plus className="h-4 w-4" />
                    New Group
                </Button>
            </div>

            {showCreateModal && (
                <Card className="border-red-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between bg-red-50/30">
                        <CardTitle>{editingGroup ? 'Edit Group' : 'Create New Group'}</CardTitle>
                        <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-red-600">
                            <X size={20} />
                        </button>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleCreateOrUpdateGroup} className="space-y-4">
                            <Input 
                                label="Group Name" 
                                placeholder="e.g. UPSC Batch A 2026" 
                                value={groupName}
                                onChange={e => setGroupName(e.target.value)}
                                required
                            />
                            <Input 
                                label="Description" 
                                placeholder="Briefly describe the purpose of this group" 
                                value={groupDescription}
                                onChange={e => setGroupDescription(e.target.value)}
                            />
                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="secondary" type="button" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                                <Button type="submit">{editingGroup ? 'Update' : 'Create'} Group</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Your Groups</h3>
                    {loading ? (
                        <div className="text-center py-10 text-slate-400 italic">Loading groups...</div>
                    ) : groups.length === 0 ? (
                        <Card className="p-10 text-center border-dashed border-2 border-slate-200 bg-slate-50/50">
                            <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-slate-500 text-sm italic">No groups created yet. Start by creating your first batch.</p>
                        </Card>
                    ) : (
                        groups.map(group => (
                            <Card key={group.id} className={`hover:shadow-md transition-all cursor-pointer ${selectedGroupForStudents?.id === group.id ? 'ring-2 ring-red-500 ring-offset-2' : ''}`} onClick={() => setSelectedGroupForStudents(group)}>
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <div className="bg-red-50 p-3 rounded-xl text-red-600">
                                                <Users size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{group.name}</h4>
                                                <p className="text-xs text-slate-500 mt-0.5">{group.description || 'No description provided'}</p>
                                                <div className="mt-3 flex items-center gap-4">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                                        {group.students?.length || 0} Students
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setEditingGroup(group); setGroupName(group.name); setGroupDescription(group.description); setShowCreateModal(true); }}
                                                className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-900 transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }}
                                                className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Add Students to {selectedGroupForStudents ? selectedGroupForStudents.name : "..."}</h3>
                    {selectedGroupForStudents ? (
                        <div className="space-y-4">
                            <Card className="bg-slate-50/50">
                                <CardContent className="p-4">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input 
                                                type="text" 
                                                value={searchQuery}
                                                onChange={e => setSearchQuery(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleSearchStudents()}
                                                placeholder="Search student by name or email..." 
                                                className="w-full pl-9 h-10 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                                            />
                                        </div>
                                        <Button size="sm" onClick={handleSearchStudents} disabled={searching}>
                                            {searching ? '...' : 'Search'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-2">
                                {searchResults.map(student => {
                                    const isInThisGroup = (selectedGroupForStudents.students || []).some(s => s.id === student.id);
                                    return (
                                        <div key={student.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg group hover:border-red-200 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">
                                                    {(student.firstName?.[0] || '') + (student.lastName?.[0] || '')}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-800">{student.firstName} {student.lastName}</p>
                                                    <p className="text-[10px] text-slate-400">{student.email}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => toggleStudentInGroup(student, selectedGroupForStudents)}
                                                className={`p-1.5 rounded-lg transition-all ${
                                                    isInThisGroup 
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                                    : 'bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600'
                                                }`}
                                            >
                                                {isInThisGroup ? <UserMinus size={16} /> : <UserPlus size={16} />}
                                            </button>
                                        </div>
                                    );
                                })}
                                {searchQuery.length > 0 && searchResults.length === 0 && !searching && (
                                    <p className="text-center text-xs text-slate-400 italic py-4">No students found.</p>
                                )}
                            </div>

                            {selectedGroupForStudents.students && selectedGroupForStudents.students.length > 0 && (
                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Currently in Group</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedGroupForStudents.students.map(s => (
                                            <div key={s.id} className="flex items-center gap-2 bg-white border border-slate-200 pl-1.5 pr-2 py-1 rounded-lg">
                                                <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">
                                                    {(s.firstName?.[0] || '') + (s.lastName?.[0] || '')}
                                                </div>
                                                <span className="text-[10px] font-medium text-slate-700">{s.firstName}</span>
                                                <button onClick={() => toggleStudentInGroup(s, selectedGroupForStudents)} className="text-slate-400 hover:text-red-600 transition-colors">
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl">
                            <p className="text-slate-400 text-sm italic">Select a group from the left to manage students.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupsPage;
