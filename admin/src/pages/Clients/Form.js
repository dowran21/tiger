import ModalContainer from "../../components/ModalContainer"
import Map from "../../components/Map"
import Layout from "../../components/Layout"
import { useLocation } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { get } from "../../application/middlewares"
import { useState } from "react"
import Loader from "../../components/Loader"
import { toast } from "react-hot-toast";
import { post } from "../../application/middlewares";
import { useNavigate } from "react-router-dom"

function Form({visible, setCloseModal}){
    const navigate = useNavigate()
    const location = useLocation()
    const token = useSelector(state=>state?.auth.token)
    // console.log(location)
    const id = location?.pathname?.split("/")[2]
    // console.log(id)
    const dispatch = useDispatch()
    const [data, setData] = useState({})
    const setLocation = (value) =>{
        console.log(value)
        // setData(old => {id:old.id, } )
        setData((prev)=>{
            // console.log(prev)
            return {...prev, lat:value.lat, lng:value.lng}
        })
    }
    const [loading, setLoading] = useState(false)
    useEffect(()=>{
        if(id){
            dispatch(get({
                url:`api/admin/get-client-info/${id}`,
                token, 
                action: (response) =>{
                    if(response.success){
                        console.log(response.data)
                        setData(response.data.data)
                    }
                }
            }))
        }
    }, [])

    // useEffect(()=>{
    //     console.log(data)
    // }, [data])
    
    const handleSubmit = ()=>{
        console.log("hello world")
        dispatch(post({
            url:`api/admin/update-location/${id}`,
            token,
            data,
            action: (response)=>{
                if(response.success){
                    navigate("/clients")
                }else{  
                    toast.error("Unknown error")
                }
            }
        }))
    }

    return (
        // <ModalContainer
        //     visible={visible}
        //     setCloseModal={setCloseModal}
        //     title="some"
        // >
        //     <div className="min-w-800 overflow-hidden h-96">
        //         <Map setLocation = {setLocation} /> 
        //     </div>

        // </ModalContainer>
        <Layout>
            <>
            <div className="px-2 w-full h-full flex flex-row">
                <div className="w-9/12 h-full">
                    <Map setLocation = {setLocation}  position = {{lat:data?.lat, lng:data?.lng}}/>
                </div>
                <div className="p-6 flex flex-col w-3/12">
                    <div className="flex flex-row w-full justify-between items-beetwen text-xl">
                        <label className="pr-1">ID:</label>
                        <span>{data?.id}</span>
                    </div>
                    <div className="flex flex-row w-full justify-between items-beetwen text-xl">
                        <label className="pr-1">Name:</label>
                        <span>{data?.name}</span>
                    </div>
                    <div className="flex flex-row w-full justify-between items-beetwen text-xl">
                        <label className="pr-1">Phone:</label>
                        <span>{data?.phone_number}</span>
                    </div>
                    <div className="flex flex-row w-full justify-between items-beetwen text-xl">
                        <label className="pr-1">Address:</label>
                        <span>{data?.address}</span>
                    </div>
                    <button type="submit" onClick={()=>handleSubmit()} disabled={loading} className="w-40 flex remove-button-bg justify-center items-center px-4 h-10 text-white transform ease-in-out duration-300 hover:scale-110 active:scale-100 font-semibold text-base rounded-full bg-green-500 hover:bg-green-400 active:bg-green-500 focus:outline-none shadow-md">
                            {loading ?
                                <div className="w-12"><Loader size="sm" /></div>
                            :
                                'Update'
                            }
                    </button>
                </div>
            </div>
            </>
        </Layout>

    )
}

export default Form