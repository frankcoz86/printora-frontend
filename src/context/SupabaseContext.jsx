import React, { createContext, useContext } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const SupabaseContext = createContext();

export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    if (context === undefined) {
        throw new Error('useSupabase must be used within a SupabaseProvider');
    }
    return context;
};

export const SupabaseProvider = ({ children }) => {
    const saveDesign = async (designData) => {
        const { data, error } = await supabase
            .from('user_designs')
            .insert([designData])
            .select();
        return { data, error };
    };

    const getDesignsForUser = async (userId) => {
        const { data, error } = await supabase
            .from('user_designs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        return { data, error };
    };

    const getDesignById = async (designId) => {
        const { data, error } = await supabase
            .from('user_designs')
            .select('*')
            .eq('id', designId)
            .single();
        return { data, error };
    };

    const saveOrder = async (orderDetails) => {
        try {
            const { data, error } = await supabase.functions.invoke('create-order', {
                body: { orderDetails },
            });

            if (error) throw error;
            
            // The edge function returns { order: savedOrderData }
            return { data: data.order, error: null };
        } catch (error) {
            console.error('Error invoking create-order function:', error);
            return { data: null, error };
        }
    };
    
    const getOrderById = async (orderId) => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();
        return { data, error };
    };

    const updateOrderStatus = async (orderId, status) => {
        const { data, error } = await supabase
            .from('orders')
            .update({ status: status })
            .eq('id', orderId);
        return { data, error };
    };

    const value = {
        supabase,
        saveDesign,
        getDesignsForUser,
        getDesignById,
        saveOrder,
        getOrderById,
        updateOrderStatus
    };

    return (
        <SupabaseContext.Provider value={value}>
            {children}
        </SupabaseContext.Provider>
    );
};