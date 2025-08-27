import axios from "axios";
// import { toast } from "react-toastify";
import { constant } from "../../constant";




const getToken = () => {
        let userDetail = localStorage.getItem("userDetail");
        let token = localStorage.getItem('token');

        if (userDetail) {
            try {
                userDetail = JSON.parse(userDetail);
                token = token ? token : userDetail?.Token;
            } catch (error) {
                console.error("Error parsing userDetail from localStorage:", error);
            }
        }

        // Prefer token from localStorage/userDetail, then fallback to constant.token
        if (!token) {
            token = constant.token || null;
        }

        // Always return a Bearer formatted token (or null if none available)
        return token ? `Bearer ${token}` : null;
    };
  


const buildUrl = (path) => {
    if (!path) return constant.baseUrl;
    // If path already looks like a full URL, return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return constant.baseUrl + path;
}

const authHeader = () => {
    const token = getToken();
    return token ? { Authorization: token } : {};
}

export const apiget = async (path) => {

    try {

        const response = await axios.get(buildUrl(path), {
            headers: {
                ...authHeader()
            }
        });

        if (response.data.token && response.data.token !== null) {
            
            localStorage.setItem('token', response.data.token);
        }

        if (response && response.status === 200) {
           console.log('--');
        }
        return response;

    } catch (error) {
        if (error && error.response) {
            if (error && error.response && error.response.status === 400) {
                if (error.response.data.message) {
                    console.log(error)
                }
            }
        }
        throw error;
    }
}

export const apipost = async (path, data) => {
    console.log(data)

    try {
        const headers = { ...authHeader() };
        
        // Don't set Content-Type for FormData - let browser set it with boundary
        if (!(data instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await axios.post(buildUrl(path), data, {
            headers,
            timeout: 60000, // 60 seconds timeout for large uploads
            maxContentLength: 50 * 1024 * 1024, // 50MB max content length
            maxBodyLength: 50 * 1024 * 1024, // 50MB max body length
        });
        if (response.data.token && response.data.token !== null) {
            localStorage.setItem('token', response?.data?.token);
        }

        if (response && response.status === 200) {
            console.log(response?.message);
        }
        return response;
    } catch (error) {
        console.error('API Post Error:', error);
        
        if (error && error.response) {
            const { status, data: errorData } = error.response;
            
            // Handle 413 Request Entity Too Large
            if (status === 413) {
                throw new Error('File size too large. Please compress files and try again.');
            }
            
            // Handle other HTTP errors
            if (errorData && error.response.status === 401) {
                if (errorData.message) {
                    console.log(errorData.message);
                }
                throw new Error('Authentication failed. Please login again.');
            }
            
            // Handle validation errors (422)
            if (status === 422 && errorData.detail) {
                const validationErrors = Array.isArray(errorData.detail) 
                    ? errorData.detail.map(err => `${err.loc?.join('.')} - ${err.msg}`).join(', ')
                    : errorData.detail;
                throw new Error(`Validation errors: ${validationErrors}`);
            }
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('Upload timeout. Please try again with smaller files.');
        } else if (error.request) {
            throw new Error('Network error. Please check your connection.');
        }
        
        throw error;
    }

}

export const apiput = async (path, data) => {

    try {
        const response = await axios.put(buildUrl(path), data, {
            headers: {
                ...authHeader()
            }
        });

        if (response.data.token && response.data.token !== null) {
            localStorage.setItem('token', response.data.token);
        }
        if (response && response.status === 200) {
            console.log('--');
        }
        return response;
    } catch (error) {
        if (error && error.response) {
            if (error && error.response && error.response.status === 400) {
                if (error.response.data.message) {
                    console.log('--');
                }
            }
        }
        throw error;
    }

}

export const apidelete = async (path) => {

    try {

        const response = await axios.delete(buildUrl(path), {
            headers: {
                ...authHeader()
            }
        });
        if (response.data.token && response.data.token !== null) {
            localStorage.setItem('token', response.data.token);
        }
        if (response && response.status === 200) {
            console.log('--');
        }

        return response;
    } catch (error) {
        if (error && error.response) {
            if (error && error.response && error.response.status === 400) {
                if (error.response.data.message) {
                    console.log('--');
                }
            }
        }
        throw error;
    }

}

export const deleteManyApi = async (path, data) => {

    try {
        const response = await axios.post(buildUrl(path), data, {
            headers: {
                ...authHeader()
            }
        });
        if (response.data.token && response.data.token !== null) {
            localStorage.setItem('token', response?.data?.token);
        }

        if (response && response.status === 200) {
            console.log('--');
        }
        return response;
    } catch (error) {
        if (error && error.response) {
            if (error && error.response.data && error.response.status === 401) {
                if (error.response.data.message) {
                    console.log('--');
                }
            }
        }
        throw error;
    }

}


export const apipatch = async (path, data) => {
   
    try {
        const response = await axios.patch(buildUrl(path), data, {
            headers: {
                ...authHeader()
            }
        });

        if (response.data.token && response.data.token !== null) {
            localStorage.setItem('token', response.data.token);
        }
        
        if (response && response.status === 200) {
            console.log('--');
        }

        return response;
    } catch (error) {
        if (error && error.response) {
            if (error.response.status === 400 || error.response.status === 401) {
                if (error.response.data.message) {
                    console.log(error.response.data.message);
                }
            }
        }
        throw error;
    }
};




