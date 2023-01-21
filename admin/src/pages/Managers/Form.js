import { Controller, useFieldArray, useForm } from 'react-hook-form';
import ModalContainer from '../../components/ModalContainer';
import * as Yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import { Select } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get, post } from '../../application/middlewares';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Loader';
import Label from "../../components/Label";
import IconButton from '../../components/IconButton';
import {BiTrash} from "@react-icons/all-files/bi/BiTrash"
import {MdDeleteForever} from "@react-icons/all-files/md/MdDeleteForever" 
import { IoMdAdd } from '@react-icons/all-files/io/IoMdAdd';
import useTimeout from '../../components/useTimeOut';

function Form({visible, setCloseModal, form, values}){

    const token = useSelector(state => state.auth.token)
    const {handleSubmit, errors, setValue, getValues, watch, register, control, reset} = useForm({
        resolver:yupResolver(schema(form))
    })
    const {fields, append, remove, update} = useFieldArray({
        control,
        name:"sls_mans",
        keyName:"key"
    })
    const [loading, setLoading] = useState();
    const [salesMans, setSalesMans] = useState([])
    const [nativeData, setNativeData] = useState([])
    useEffect(()=>{
        if(visible && form==="update"){
            dispatch(get({
                url:`api/admin/get-clients-for-sls/${values.id}`,
                token,
                action: (response) =>{
                    if(response.success){
                        setSalesMans(response.data?.not_included)
                        setNativeData(response.data?.not_included)
                        setValue("sls_mans", response?.data?.included)
                    }else{
                        toast.error("Unknown error")
                    }
                }
            }))
        }
    }, [visible])

    const onSubmit = (data) =>{
        if(form === "update"){
            let new_data = data.sls_mans?.filter(item => !item.usm_id)
            if(new_data.length){
                dispatch(post({
                    url:`api/admin/add-clietns-to-sls/${values?.id}`,
                    token, 
                    data:new_data,
                    action: (response) =>{
                        if(response.success){
                            setCloseModal()
                        }else{
                            toast.error("Unknown error")
                        }
                    }
                }))
            }
        }
        if(form !== "update"){
            dispatch(post({
                url:`api/admin/add-operator`,
                token,
                data,
                action: (response) =>{
                    if(response.success){
                        console.log("hello");
                        setCloseModal()
                    }else{
                        toast.error("Some error")
                    }
                }
            }))
        }
        
    }
    const [firms, setFirms] = useState([])
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(get({
            url:`api/user/get-firms`,
            token, 
            action: (response) =>{
                if(response.success){
                    setFirms(response.data.rows?.map(item => {
                        return {label:item.name, value:item.id}
                    }))
                }else{
                    toast.error("Unknown error")
                }
            }
        }))
    }, [visible])
    const handleDeleteTypeSpecValue = (id,  index) =>{
        // console.log(item)
        dispatch(post({
            url:`api/admin/delete-client-from-sls-man/${id}`,
            token, 
            action: (response) =>{
                if(response.success){
                    remove(index)
                }else{
                    toast.error("Unknown error")
                }
            }
        }))

    } 
    // const filterData = (value) =>{
    //     if(value){
    //         useTimeout({action:()=>{
    //             setSalesMans(nativeData.filter(item => item.includes(value)))
    //         }, time:500})
    //     }
    // }
    const filterData = useTimeout({time:500, action: (value)=>setSalesMans(nativeData.filter(item=>item.name.toLowerCase().includes(value.toLowerCase())))})
    return (
        <ModalContainer
            visible={visible}
            setCloseModal={()=>{
                setCloseModal();
                setSalesMans([]);
                reset({name:"", password:"", role_id:"", sls_mans:[]})
            }
            }
            title="Operator add"
            size = {form==="update" ? "lg" : ""}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="w-full pb-12 flex flex-col justify-center items-center">
                {form==="add" ?
                <>
                <div className='w-full flex flex-col'>
                    <div className="relative w-full mb-6">
                        <label>Полное Имя</label>
                        <input type="text" {...register("name")}
                            autoComplete="false"
                            className={`${errors?.name ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-3 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                            placeholder="напр. Довран Джумакулыев"
                        />
                        <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                            {errors?.name?.message}
                        </p>
                    </div>
                    <div className="relative w-full mb-6">
                        <label>password</label>
                        <input type="password" {...register("password")}
                            autoComplete="false"
                            className={`${errors?.password ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-3 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                            placeholder="напр. Довран Джумакулыев"
                        />
                        <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                            {errors?.password?.message}
                        </p>
                    </div>
                    <div className='relative w-full mb-6'>
                        <Controller
                            control = {control}
                            name="role_id"
                            render = {({field : {onChange, value}})=>
                            <Select
                                label = "Select frim"
                                onChange={onChange}
                                value = {value}
                                data={[{label:"Supervisor", value:3}, {label:"Moderator", value:2}]}
                                placeholder={"Birini saylan"}
                            />
                            }
                        />
                    </div>
                </div>
                </>
                :
                <>
                <div className="relative flex flex-row w-full mb-4 shadow-inner bg-gray-50 lg:h-96 lg:max-h-96 h-64 max-h-64 min-w-600" >
                    <div className='flex flex-col w-1/2'>
                    <div className='w-full flex md:flex-row justify-center  lg:items-end my-2 px-2 rounded-md '>
                        <input
                            className='ring-indigo-600 px-3 shadow-inner h-10 w-full text-base bg-white rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2'
                            placeholder='Search text'
                            onChange={(e)=>filterData(e.target.value)}
                        />
                    </div>
                    <div className="relative w-full flex flex-col justify-start items-start px-2 rounded-lg h-full  overflow-y-auto">
                        {salesMans?.map((item, index) => {
                            return(
                                <div key={index} className={`${index % 2 === 0 ? 'bg-green-100' : 'bg-yellow-100'} w-full rounded-lg my-2 px-2 py-1 flex flex-row justify-between items-center`}>
                                    <Label>{item.name}</Label>
                                    <IconButton handleClick={() => {
                                        append({...item});
                                        setSalesMans(salesMans.filter(item2 => +item.id!== +item2.id))
                                    }} icon={<IoMdAdd className="text-2xl "/>}/>
                                </div>
                            )
                        })}
                    </div>
                    </div>
                    <div className="w-1 h-full bg-blue-300 rounded"></div>
                 <div className={`${errors?.sales_mans?.message ? ' border-red-300 ring-red-100 border-2' : '' } relative w-1/2 flex flex-col justify-start items-start px-2  rounded-lg h-full  overflow-y-auto`}>
                       
                        {fields.map((field, index) => {
                            return (
                                <div key={index} className={`${index % 2 === 0 ? 'bg-green-100' : 'bg-yellow-100'} w-full flex flex-col md:flex-row justify-center  lg:items-end my-2 px-2 rounded-md `}>
                                    <div  className={`w-full flex justify-start items-center md:h-full`}>
                                        <Label>{field.name}</Label>
                                    </div>
                                    <div className="w-48 flex justify-center items-center mt-6 lg:mt-0">
                                        {field.usm_id ?
                                            <div className="w-full flex flex-row justify-between items-center">
                                                {/* <Switcher item_id={field.id} status={!field.deleted} handleStatus={(enabled) => handleDeleteTypeSpecValue(field, index, enabled)}/> */}
                                                <IconButton  handleClick = {() => {
                                                    handleDeleteTypeSpecValue(field.usm_id, index)
                                                    // remove(index);
                                                    setSalesMans([...salesMans, {id:field.id, name:field.name}])
                                                }
                                                }
                                                    icon = {<BiTrash className='text-2xl'/>}
                                                />
                                            </div>
                                        :  
                                        <div className="w-full flex flex-row justify-between items-center">
                                            <IconButton handleClick={() => {
                                                // setState({type:'ADD_ITEM', payload:{spec_id:field.spec_id, name_ru:field.name_ru, name_tm:field.name_tm, absolute_name:field.absolute_name }})
                                                remove(index);
                                            }} icon={<MdDeleteForever className="text-2xl "/>}/>
                                        </div>
                                        }
                                    </div>
                                </div>
                        )})}
                    </div>
                    </div>
                </>
                }
                <button type="submit" disabled={loading} className="w-40 flex remove-button-bg justify-center items-center px-4 h-15 text-white transform ease-in-out duration-300 hover:scale-110 active:scale-100 font-semibold text-base rounded-full bg-green-500 hover:bg-green-400 active:bg-green-500 focus:outline-none shadow-md">
                    {loading ?
                        <div className="w-12 h-10 "><Loader size="sm" /></div>
                    :
                    <div className="h-10 flex justify-center items-center">{form==="update" ? "Обновить" : "Добавить" }</div> 
                    }
                </button>

            </form>
        </ModalContainer>
    )
}

const schema = (form) => Yup.object().shape({
    name: form === "update" ? Yup.string().nullable(true) :  Yup.string().required().min(3).max(15),
    password:form === "update" ? Yup.string().nullable(true) : Yup.string().required().min(5).max(15),
    role_id:form === "update" ? Yup.string().nullable(true) : Yup.number().required(),
    sls_mans: form === "update" ? Yup.array().of(
        Yup.object().shape({
            id:Yup.number().required()
        })
    ) : Yup.string().nullable(true)
})

export default Form