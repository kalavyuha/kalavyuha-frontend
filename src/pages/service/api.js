import axios from "axios";
// import { toast } from "react-toastify";
import { constant } from "../../constant";




const getToken = () => {
    let userDetail = localStorage.getItem("userDetail");
    let token = localStorage.getItem('token');
  
    if (userDetail) {
      try {
        userDetail = JSON.parse(userDetail);
        token =token ? token : userDetail?.Token ;
      } catch (error) {
        console.error("Error parsing userDetail from localStorage:", error);
      }
    }
  
    if (!token) {
      token = generateToken();
    }

    return `Bearer ${token}`;
  };
  
  const generateToken = () => {
    return "QG4T2o01luXCMUMD";
  };
  


export const apiget = async (path) => {

    try {

        const response = await axios.get(constant.baseUrl + path, {
            headers: {
                'Authorization': getToken()
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
        const response = await axios.post(constant.baseUrl + path, data, {
            headers: {
                'Authorization': getToken()
            }
        });
        if (response.data.token && response.data.token !== null) {
            localStorage.setItem('token', response?.data?.token);
        }

        if (response && response.status === 200) {
            console.log(response?.message);
        }
        return response;
    } catch (error) {
        if (error && error.response) {
            if (error && error.response.data && error.response.status === 401) {
                if (error.response.data.message) {
                    console.log(error.response.data.message);
                }
            }
        }
        throw error;
    }

}

export const apiput = async (path, data) => {

    try {
        const response = await axios.put(constant.baseUrl + path, data, {
            headers: {
                'Authorization': getToken()
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

        const response = await axios.delete(constant.baseUrl + path, {
            headers: {
                'Authorization': getToken()
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
        const response = await axios.post(constant.baseUrl + path, data, {
            headers: {
                'Authorization': getToken()
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
        const response = await axios.patch(constant.baseUrl + path, data, {
            headers: {
                'Authorization': getToken()
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




