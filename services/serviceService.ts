import { supabase } from '../lib/supabase';
import { Service } from '../types';
import {
    Bot,
    Workflow,
    Code2,
    Palette,
    Megaphone,
    BrainCircuit,
    PenTool,
    Video,
    Cpu,
    Activity,
    Layers,
    Globe,
    Database,
    Server,
    Terminal,
    LucideIcon
} from 'lucide-react';

export interface DbService {
    id: string;
    title: string;
    short_description: string | null;
    full_description: string | null;
    icon_name: string;
    color: string;
    features: string[];
    order_index: number;
    created_at: string;
    updated_at: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
    'Bot': Bot,
    'Workflow': Workflow,
    'Code2': Code2,
    'Palette': Palette,
    'Megaphone': Megaphone,
    'BrainCircuit': BrainCircuit,
    'PenTool': PenTool,
    'Video': Video,
    'Cpu': Cpu,
    'Activity': Activity,
    'Layers': Layers,
    'Globe': Globe,
    'Database': Database,
    'Server': Server,
    'Terminal': Terminal
};

export const serviceService = {
    /**
     * Fetch all services from database
     */
    async getAllServices(): Promise<Service[]> {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('order_index', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching services:', error);
                return [];
            }

            return data ? data.map(dbServiceToService) : [];
        } catch (error) {
            console.error('Exception fetching services:', error);
            return [];
        }
    },

    /**
     * Create a new service
     */
    async createService(service: Partial<Service>): Promise<Service | null> {
        try {
            // Default icon if not specified or invalid
            const iconName = service.icon
                ? Object.keys(ICON_MAP).find(key => ICON_MAP[key] === service.icon) || 'Bot'
                : 'Bot';

            const { data, error } = await supabase
                .from('services')
                .insert({
                    title: service.title,
                    short_description: service.shortDescription,
                    full_description: service.fullDescription,
                    icon_name: iconName,
                    color: service.color || 'text-blue-400',
                    features: service.features || [],
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating service:', error);
                return null;
            }

            return data ? dbServiceToService(data) : null;
        } catch (error) {
            console.error('Exception creating service:', error);
            return null;
        }
    },

    /**
     * Update an existing service
     */
    async updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
        try {
            const updatePayload: any = {
                title: updates.title,
                short_description: updates.shortDescription,
                full_description: updates.fullDescription,
                color: updates.color,
                features: updates.features,
                updated_at: new Date().toISOString()
            };

            if (updates.icon) {
                const iconName = Object.keys(ICON_MAP).find(key => ICON_MAP[key] === updates.icon);
                if (iconName) updatePayload.icon_name = iconName;
            }

            const { data, error } = await supabase
                .from('services')
                .update(updatePayload)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating service:', error);
                return null;
            }

            return data ? dbServiceToService(data) : null;
        } catch (error) {
            console.error('Exception updating service:', error);
            return null;
        }
    },

    /**
     * Delete a service
     */
    async deleteService(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting service:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Exception deleting service:', error);
            return false;
        }
    },
};

// Helper to convert DB service to Service type
function dbServiceToService(dbService: DbService): Service {
    return {
        id: dbService.id,
        title: dbService.title,
        shortDescription: dbService.short_description || '',
        fullDescription: dbService.full_description || '',
        icon: ICON_MAP[dbService.icon_name] || Bot,
        color: dbService.color,
        features: dbService.features,
    };
}
