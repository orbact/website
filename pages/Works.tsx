import React, { useState, useEffect } from 'react';
import { CaseStudy } from '../types';
import TiltCard from '../components/TiltCard';
import Button from '../components/Button';
import { Filter, Plus, Upload, X, ExternalLink, Github, ArrowUpRight, Search, Layers, Loader2, Edit, Trash2, Lock, LogOut, Shield, Star } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { adminAuth } from '../lib/adminAuth';
import SEO from '../components/SEO';
import EmptyState from '../components/EmptyState';
import useScrollReveal from '../hooks/useScrollReveal';

const CATEGORIES = [
    'All',
    'AI/ML Engineering',
    'Agents & Workflows',
    'Web & App Dev',
    'UI/UX Design',
    'Data Science',
    'Digital Marketing',
    'Graphics Design',
    'Video Editing',
    'Robotics Engineering'
];

// 3D Visual for Hero Section
const WorksCore: React.FC = () => {
    return (
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center perspective-[1000px]">
            <div className="absolute inset-0 bg-accent-primary/5 blur-3xl rounded-full" />
            <div className="relative w-40 h-40 transform-style-3d animate-[spin_20s_linear_infinite]">
                <div className="absolute inset-0 border-2 border-dashed border-accent-primary/30 rounded-full" style={{ transform: 'rotateX(60deg)' }} />
                <div className="absolute inset-0 border-2 border-dashed border-accent-secondary/30 rounded-full" style={{ transform: 'rotateY(60deg)' }} />
                <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center animate-float">
                <Layers size={64} className="text-text-main drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
            </div>
        </div>
    );
};

const Works: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [projects, setProjects] = useState<CaseStudy[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);

    // Admin State - simplified since login is now global
    const [isAdmin, setIsAdmin] = useState(adminAuth.isAdmin());
    const [editingProject, setEditingProject] = useState<CaseStudy | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    // Form State
    const [newProject, setNewProject] = useState<Partial<CaseStudy>>({
        title: '',
        category: 'AI/ML Engineering',
        description: '',
        image: '',
        link: '',
        huggingFaceLink: '',
        stats: []
    });

    // Update admin state when auth changes
    useEffect(() => {
        setIsAdmin(adminAuth.isAdmin());
    }, [deleteConfirmId, editingProject]); // Re-check on operations

    // Load projects from Supabase + demo data
    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setIsLoading(true);
        try {
            const dbProjects = await projectService.getAllProjects();
            // Only show database projects (no demo data)
            setProjects(dbProjects);
        } catch (error) {
            console.error('Error loading projects:', error);
            setProjects([]);
        } finally {
            setIsLoading(false);
        }
    };

    const addToRefs = useScrollReveal([projects, activeCategory]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Store the file for later upload
            setUploadedImageFile(file);

            // Show preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProject(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePublish = async () => {
        if (!newProject.title || !newProject.description || !newProject.category) return;

        setIsUploading(true);

        try {
            let imageUrl = newProject.image || '';

            // Upload image to Supabase Storage if file was selected
            if (uploadedImageFile) {
                const uploadedUrl = await projectService.uploadImage(uploadedImageFile);
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                }
            }

            // Create project object
            const project: Omit<CaseStudy, 'id'> = {
                title: newProject.title!,
                category: newProject.category!,
                description: newProject.description!,
                image: imageUrl || `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 100)}`,
                stats: [],
                link: newProject.link,
                huggingFaceLink: newProject.huggingFaceLink
            };

            // Save to Supabase
            const createdProject = await projectService.createProject(project);

            if (createdProject) {
                // Update UI immediately
                setProjects(prev => [...prev, createdProject]);
                setIsModalOpen(false);

                // Reset Form
                setNewProject({
                    title: '',
                    category: 'AI/ML Engineering',
                    description: '',
                    image: '',
                    link: '',
                    huggingFaceLink: '',
                    stats: []
                });
                setUploadedImageFile(null);
            } else {
                alert('Failed to create project. Please try again.');
            }
        } catch (error) {
            console.error('Error publishing project:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    // Admin Functions
    const handleEdit = (project: CaseStudy) => {
        setEditingProject(project);
        setNewProject({
            title: project.title,
            category: project.category,
            description: project.description,
            image: project.image,
            link: project.link,
            huggingFaceLink: project.huggingFaceLink,
            stats: project.stats
        });
        setIsModalOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingProject || !newProject.title || !newProject.description) return;

        setIsUploading(true);
        try {
            let imageUrl = newProject.image || '';

            if (uploadedImageFile) {
                const uploadedUrl = await projectService.uploadImage(uploadedImageFile);
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                }
            }

            const updates: Partial<CaseStudy> = {
                title: newProject.title!,
                category: newProject.category!,
                description: newProject.description!,
                image: imageUrl,
                link: newProject.link,
                huggingFaceLink: newProject.huggingFaceLink,
                stats: newProject.stats || []
            };

            const updated = await projectService.updateProject(editingProject.id, updates);

            if (updated) {
                setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
                setIsModalOpen(false);
                setEditingProject(null);
                setNewProject({
                    title: '',
                    category: 'AI/ML Engineering',
                    description: '',
                    image: '',
                    link: '',
                    huggingFaceLink: '',
                    stats: []
                });
                setUploadedImageFile(null);
            } else {
                alert('Failed to update project');
            }
        } catch (error) {
            console.error('Error updating project:', error);
            alert('An error occurred while updating');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const success = await projectService.deleteProject(id);
        if (success) {
            setProjects(prev => prev.filter(p => p.id !== id));
            setDeleteConfirmId(null);
        } else {
            alert('Failed to delete project');
        }
    };

    const handleToggleSelection = async (project: CaseStudy) => {
        const newStatus = !project.isSelected;
        const result = await projectService.toggleProjectSelection(project.id, newStatus);

        if (result.success) {
            setProjects(prev => prev.map(p =>
                p.id === project.id ? { ...p, isSelected: newStatus } : p
            ));
        } else {
            alert(result.message || 'Failed to update selection');
        }
    };

    const filteredProjects = activeCategory === 'All'
        ? projects
        : projects.filter(p => p.category === activeCategory);

    return (
        <div className="min-h-screen bg-bg-page relative overflow-x-hidden selection:bg-accent-secondary selection:text-white pb-20">
            <SEO
                title="Case Studies | Orbact"
                description="See how we've helped fintech, logistics, and healthcare companies scale with AI."
            />
            {/* Ambient Background & Grid */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-accent-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-accent-secondary/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 animate-grid-flow-lg" />
            </div>

            {/* Hero */}
            <section className="relative z-10 min-h-[60vh] flex pt-36 md:pt-48 pb-12">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        <div ref={addToRefs} className="opacity-0 translate-y-20 transition-all duration-1000 ease-out">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface border border-border-subtle text-xs font-bold uppercase tracking-widest text-accent-primary mb-6">
                                <Search size={12} />
                                <span>Case Studies</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-main leading-[1.1] mb-6">
                                Our Work <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-white to-accent-secondary animate-shine bg-[length:200%_auto]">In Action.</span>
                            </h1>
                            <p className="text-lg text-muted max-w-lg leading-relaxed border-l-2 border-border-subtle pl-6">
                                From custom LLMs to high-performance web apps, explore how we deliver value.
                            </p>
                        </div>
                        <div ref={addToRefs} className="flex justify-center lg:justify-end opacity-0 scale-90 transition-all duration-1000 ease-out delay-200">
                            <WorksCore />
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Filter Bar */}
            <div className="sticky top-24 z-40 mb-12 pointer-events-none">
                <div className="container mx-auto px-2 md:px-6 flex justify-center">
                    <div className="pointer-events-auto bg-bg-page/70 backdrop-blur-xl border border-border-subtle p-1.5 rounded-2xl md:rounded-full shadow-2xl flex items-center gap-1 overflow-x-auto w-full md:w-auto max-w-full no-scrollbar">
                        <div className="px-4 text-muted hidden md:block">
                            <Filter size={16} />
                        </div>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeCategory === cat
                                    ? 'bg-text-main text-bg-page shadow-lg'
                                    : 'text-muted hover:text-text-main hover:bg-bg-surface'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <section className="container mx-auto px-6 relative z-10 pb-20">
                {isLoading ? (
                    // Simple loading state - could be replaced with Skeleton later
                    <div className="flex justify-center py-20">
                        <Loader2 size={40} className="animate-spin text-accent-primary" />
                    </div>
                ) : filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredProjects.map((project, index) => (
                            <div
                                key={project.id}
                                ref={addToRefs}
                                className="opacity-0 translate-y-20 transition-all duration-700 ease-out"
                                style={{ transitionDelay: `${index * 50}ms` }}
                                onMouseEnter={() => setHoveredCard(project.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <TiltCard className="h-full min-h-[400px] flex flex-col rounded-[24px] bg-bg-card border border-border-subtle overflow-hidden group hover:border-border-strong relative [mask-image:linear-gradient(white,white)]">
                                    {/* Image Area */}
                                    <div className="relative h-[240px] overflow-hidden">
                                        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent opacity-80" />

                                        {/* Admin Controls - Top Left */}
                                        {isAdmin && (
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(project);
                                                    }}
                                                    className="p-2 bg-blue-500/90 backdrop-blur-md rounded-full text-white hover:bg-blue-600 transition-all shadow-lg"
                                                    title="Edit Project"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleSelection(project);
                                                    }}
                                                    className={`p-2 backdrop-blur-md rounded-full transition-all shadow-lg ${project.isSelected
                                                        ? 'bg-yellow-500/90 text-white hover:bg-yellow-600'
                                                        : 'bg-bg-surface/50 text-muted hover:bg-yellow-500/90 hover:text-white'
                                                        }`}
                                                    title={project.isSelected ? "Remove from Selected Works" : "Add to Selected Works"}
                                                >
                                                    <Star size={14} fill={project.isSelected ? "currentColor" : "none"} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteConfirmId(project.id);
                                                    }}
                                                    className="p-2 bg-red-500/90 backdrop-blur-md rounded-full text-white hover:bg-red-600 transition-all shadow-lg"
                                                    title="Delete Project"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}

                                        <div className="absolute top-4 right-4 flex gap-2">
                                            {project.link && (
                                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-bg-surface/50 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all" title="Live Link">
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                            {project.huggingFaceLink && (
                                                <a href={project.huggingFaceLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-bg-surface/50 backdrop-blur-md rounded-full text-white hover:bg-[#FFD21E] hover:text-black transition-all" title="HuggingFace">
                                                    <span className="font-bold text-xs">HF</span>
                                                </a>
                                            )}
                                        </div>
                                        <div className="absolute bottom-4 left-4">
                                            <span className="px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                                {project.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-2xl font-bold text-text-main mb-3 group-hover:text-accent-secondary transition-colors">{project.title}</h3>
                                        <p className="text-muted text-sm leading-relaxed mb-6 flex-grow">{project.description}</p>

                                        <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-muted">
                                            <span>ID: {project.id.split('-')[0]}</span>
                                            <div className="flex items-center gap-1 group-hover:gap-2 transition-all text-text-main font-medium">
                                                View Details <ArrowUpRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </TiltCard>
                            </div>
                        ))}

                        {/* Add Project Card - Visible only for Admin */}
                        {isAdmin && (
                            <div
                                ref={addToRefs}
                                className="opacity-0 translate-y-20 transition-all duration-700 ease-out"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <div className="h-full min-h-[400px] rounded-[24px] border-2 border-dashed border-border-subtle hover:border-accent-primary hover:bg-bg-surface/30 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group gap-4 p-8 text-center">
                                    <div className="w-16 h-16 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center group-hover:scale-110 group-hover:bg-accent-primary group-hover:text-black transition-all duration-300">
                                        <Plus size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-text-main mb-1">Deploy Project</h3>
                                        <p className="text-sm text-muted">Initialize a new case study</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Empty State
                    <div className="max-w-md mx-auto py-20 animate-fade-in-up">
                        <EmptyState 
                            title={activeCategory === 'All' ? 'No Projects Yet' : `No ${activeCategory} Projects`}
                            description={isAdmin ? "Your portfolio is empty. Add your first masterpiece to show the world." : "We haven't published any case studies in this category yet. Check back soon!"}
                            actionLabel={isAdmin ? "Initialize Project" : undefined}
                            onAction={isAdmin ? () => setIsModalOpen(true) : undefined}
                        />
                    </div>
                )}
            </section>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-bg-card border border-border-subtle rounded-2xl w-full max-w-lg shadow-2xl p-6 md:p-8 animate-fade-in-up">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-muted hover:text-text-main hover:bg-bg-surface rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold text-text-main mb-6">Initialize Project</h2>

                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                            {/* Image Upload */}
                            <div className="w-full h-40 border-2 border-dashed border-border-subtle rounded-xl flex flex-col items-center justify-center relative hover:border-accent-primary transition-colors cursor-pointer bg-bg-surface/50 group overflow-hidden">
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                {newProject.image ? (
                                    <img src={newProject.image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <Upload size={24} className="text-muted group-hover:text-accent-primary mb-2" />
                                        <span className="text-xs text-muted font-bold uppercase tracking-wider">Upload Cover Image</span>
                                    </>
                                )}
                            </div>

                            {/* Fields */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted">Category</label>
                                <select
                                    value={newProject.category}
                                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                                    className="w-full bg-bg-page border border-border-subtle rounded-lg px-4 py-3 text-sm text-text-main focus:border-accent-primary focus:outline-none"
                                >
                                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted">Project Name</label>
                                <input
                                    type="text"
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    className="w-full bg-bg-page border border-border-subtle rounded-lg px-4 py-3 text-sm text-text-main focus:border-accent-primary focus:outline-none"
                                    placeholder="e.g. Neural Nexus"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted">Description</label>
                                <textarea
                                    rows={3}
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    className="w-full bg-bg-page border border-border-subtle rounded-lg px-4 py-3 text-sm text-text-main focus:border-accent-primary focus:outline-none resize-none"
                                    placeholder="Project objectives and impact..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2"><Github size={12} /> HuggingFace</label>
                                    <input
                                        type="text"
                                        value={newProject.huggingFaceLink}
                                        onChange={(e) => setNewProject({ ...newProject, huggingFaceLink: e.target.value })}
                                        className="w-full bg-bg-page border border-border-subtle rounded-lg px-4 py-3 text-sm text-text-main focus:border-accent-primary focus:outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2"><ExternalLink size={12} /> Live URL</label>
                                    <input
                                        type="text"
                                        value={newProject.link}
                                        onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                                        className="w-full bg-bg-page border border-border-subtle rounded-lg px-4 py-3 text-sm text-text-main focus:border-accent-primary focus:outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border-subtle">
                            <Button
                                onClick={editingProject ? handleUpdate : handlePublish}
                                className="w-full justify-center flex items-center gap-2"
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        {uploadedImageFile ? 'Uploading Image...' : (editingProject ? 'Updating...' : 'Publishing...')}
                                    </>
                                ) : (
                                    editingProject ? 'Update Project' : 'Publish Project'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
                    <div className="relative bg-bg-card border border-red-500/30 rounded-2xl w-full max-w-md shadow-2xl p-6 md:p-8 animate-fade-in-up">
                        <div className="text-center mb-6">
                            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
                                <Trash2 size={28} className="text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-text-main mb-2">Delete Project?</h2>
                            <p className="text-sm text-muted">
                                Are you sure you want to delete this project? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 justify-center"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => handleDelete(deleteConfirmId)}
                                className="flex-1 justify-center bg-red-500 hover:bg-red-600 border-red-500"
                            >
                                <Trash2 size={16} />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Works;
