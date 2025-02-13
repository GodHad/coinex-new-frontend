/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminHook } from '@/types/admin-hook';
import { AdminData } from '@/types/admin-data';
import { Exchange } from '@/types/exchanges-data';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
};

export const addUser = async (data: any) => {
    try {
        const response = await axios.post(`${backendUrl}api/admin/add-user`, data, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });
        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error)
        return false;
    }
}

export const registerUser = async (data: any) => {
    try {
        const response = await axios.post(`${backendUrl}api/auth/register`, data);
        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error)
        return false;
    }
}

export const loginUser = async (data: any) => {
    try {
        const response = await axios.post(`${backendUrl}api/auth/login`, data, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });
        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const updateUser = async (data: any) => {
    try {
        const response = await axios.post(`${backendUrl}api/auth/update-user`, data, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });
        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const loginWithJWT = async () => {
    try {
        const response = await axios.get(`${backendUrl}api/auth/login-with-jwt`, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });
        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const getHooks = async (jwtToken: string) => {
    const response = await axios.get(`${backendUrl}api/hooks`, {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    });
    return response.data;
}

export const insertHook = async (hook: any, isUsingAdminHook: boolean) => {
    try {
        const response = await axios.post(`${backendUrl}api/hooks/create`, { ...hook, isUsingAdminHook }, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });
        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const updateHook = async (hook: any, isUsingAdminHook: boolean) => {
    try {
        const response = await axios.put(`${backendUrl}api/hooks/update/${hook._id}`, { ...hook, isUsingAdminHook }, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });
        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const deleteHook = async (id: string) => {
    try {
        const response = await axios.delete(`${backendUrl}api/hooks/${id}`, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });
        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const getHistories = async ({
    perPage = 10,
    searchTerm = '',
    currentPage = 1,
    filter = '',
    source = '',
}: {
    perPage?: number,
    searchTerm?: string;
    currentPage?: number;
    filter?: string;
    source?: string;
}) => {
    try {
        const response = await axios.get(`${backendUrl}api/histories?perPage=${perPage}&currentPage=${currentPage}&searchTerm=${searchTerm}&filter=${filter}&source=${source}`, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        })
        return response.data
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const getUsers = async () => {
    try {
        const response = await axios.get(`${backendUrl}api/users`, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        })
        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return [];
    }
}

export const updateSubscribe = async (id: string) => {
    const response = await axios.put(`${backendUrl}api/users/update-subscribe/${id}`, {}, {
        headers: {
            Authorization: `Bearer ${getCookie('jwtToken')}`
        }
    });
    return response.data;
}

export const deleteUser = async (id: string) => {
    const response = await axios.delete(`${backendUrl}api/users/delete/${id}`, {
        headers: {
            Authorization: `Bearer ${getCookie('jwtToken')}`
        }
    })
    return response.data;
}

export const getAdminHooks = async () => {
    const response = await axios.get(`${backendUrl}api/hooks/admin-hooks`, {
        headers: {
            Authorization: `Bearer ${getCookie('jwtToken')}`
        }
    });
    return response.data;
}

export const getGeneralHooks = async () => {
    const response = await axios.get(`${backendUrl}api/admin/all-hooks`, {
        headers: {
            Authorization: `Bearer ${getCookie('jwtToken')}`
        }
    });
    return response.data;
}

export const insertAdminHook = async (hook: Partial<AdminHook>) => {
    try {
        const response = await axios.post(`${backendUrl}api/admin/hooks/create`, hook, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });
        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const updateAdminHook = async (hook: Partial<AdminHook>) => {
    try {
        const response = await axios.put(`${backendUrl}api/admin/hooks/update/${hook._id}`, hook, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });
        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const deleteAdminHook = async (id: string) => {
    try {
        const response = await axios.delete(`${backendUrl}api/admin/hooks/${id}`, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });
        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const getOverview = async () => {
    try {
        const response = await axios.get(`${backendUrl}api/admin/overview`, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });

        return response.data;
    } catch (error: any) {
        console.log(error);
        // toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const resentHistory = async (id: string) => {
    try {
        const response = await axios.get(`${backendUrl}api/webhooks/resend/${id}`, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });

        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const getDashboardOverview = async () => {
    try {
        const response = await axios.get(`${backendUrl}api/users/get-overview`, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });

        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const getAdminData = async () => {
    try {
        const response = await axios.get(`${backendUrl}api/admin/admin-data`, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });

        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const updateAdminData = async (adminData: Partial<AdminData>) => {
    try {
        const response = await axios.post(`${backendUrl}api/admin/update-admin-data`, adminData, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });

        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const getHomepageData = async () => {
    try {
        const response = await axios.get(`${backendUrl}api/users/homepage`);

        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const getSocialLinks = async (jwtToken: string) => {
    try {
        const response = await axios.get(`${backendUrl}api/users/social-links`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });

        return response.data;
    } catch(error: any) {
        console.error(error)
        return false;
    }
}

export const getSidebarTitle = async (jwtToken: string) => {
    try {
        const response = await axios.get(`${backendUrl}api/users/get-sidebar-title`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });

        return response.data;
    } catch(error: any) {
        console.error(error)
        return false;
    }
}
export const getExchangesData = async () => {
    try {
        const response = await axios.get(`${backendUrl}api/admin/exchanges`, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });

        return response.data;
    } catch(error: any) {
        console.error(error)
        return false;
    }
}
export const addExchange = async (formData: Partial<Exchange>) => {
    try {
        const response = await axios.post(`${backendUrl}api/admin/add-exchange`, formData, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });

        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}
export const updateExchange = async (formData: Partial<Exchange>) => {
    try {
        const response = await axios.post(`${backendUrl}api/admin/update-exchange`, formData, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });

        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}
export const deleteExchange = async (id: string) => {
    try {
        const response = await axios.delete(`${backendUrl}api/admin/delete-exchange/${id}`, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });
        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const toggleExchangeStatus = async (id: string) => {
    try {
        const response = await axios.post(`${backendUrl}api/admin/toggle-exchange/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${getCookie('jwtToken')}`
            }
        });
        return response.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const getPageData = async ()  => {
    try {
        const response = await axios.get(`${backendUrl}api/users/get-page-data`);
        return response.data.data;
    } catch (error: any) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}