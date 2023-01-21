import { useEffect, useReducer } from "react";
import BgLoader from "../../components/BgLoader";
import Row from "../../components/Table/Row";
import Table from "../../components/Table/Table";
import Cell from "../../components/Table/Cell";
import Head from "../../components/Table/Head";
import Body from "../../components/Table/Body";
import Form from "./Form"
import IconButton from "../../components/IconButton";
import { IoMdAdd } from "@react-icons/all-files/io/IoMdAdd";
import { useDispatch, useSelector } from "react-redux";
import { get, post } from "../../application/middlewares";
import { toast } from "react-hot-toast";
import { BiEdit } from "@react-icons/all-files/bi/BiEdit";
import { Select } from "@mantine/core";

const { default: Layout } = require("../../components/Layout");

function reducer(state, action){
    console.log(action)
    switch(action.type){
        case "SET_DATA":
            return {
                ...state,
                data:action.payload.rows

            }
        case "OPEN_MODAL":
            return {
                ...state,
                visible:true,
                form:"add"
            }
        case "ClOSE_MODAL":
            return {
                ...state,
                visible:false
            }
        case "EDIT_MODAL":
            return {
                ...state, 
                visible:true,
                form:"update",
                values:action.payload
            }
        case "SET_FIRMS":
            return{
                ...state,
                firms:action.payload
            }
        case "SET_WHS":
            return {
                ...state,
                warehouses:action.payload
            }
        case "CHANGE_WH":
            return {
                ...state,
                data:state.data.map(item=>{
                    // console.log(item)
                    // console.log(action.paylaod.id)
                    // console.log(item.id)
                    if(item.id == action?.payload?.id){
                        console.log(item)
                        item.wh_id = action.payload?.value
                    }
                    return item;
                })
            }
        case "CHANGE_FIRM":
            return {
                ...state,
                data:state.data.map(item=>{
                    if(item.id == action?.payload?.id){
                        console.log(item)
                        item.firm_id = action.payload?.value
                    }
                    return item;
                })
            }
        default: 
            return {
                ...state
            }
    }
}

function Managers (){

    const [state, setState] = useReducer(reducer, {
        data:[], loading:false, visible:false, values:{},warehouses:[]
    })
    const token = useSelector(state=>state.auth.token)
    const dispatch = useDispatch()
    // const roles = {
    //     3:"Supervisor",
    //     2:"Moderator",
    // }
    useEffect(()=>{
        dispatch(get({
            url:`api/admin/get-sls-mans-for-mod`,
            token,
            action: (response) =>{
                if(response.success){
                    setState({type:"SET_DATA", payload:response.data})
                }else{
                    toast.error("Unknown error")
                }
            }
        }))
        dispatch(get({
            url:`api/user/get-firms`,
            token,
            action: (response) =>{
                if(response.success){
                    setState({type:"SET_FIRMS", payload:response.data.rows})
                }
            }
        }))
        dispatch(get({
            url:`api/admin/get-whs`,
            token,
            action: (response) =>{
                if(response.success){
                    setState({type:"SET_WHS", payload:response.data.rows})
                }
            }
        }))
    }, [])
    const changeWh = ({id, value})=>{
        console.log(id, value)
        dispatch(post({
            url:`api/admin/change-sls-wh/${id}`,
            token,
            data:{value},
            action: (response)=>{
                if(response.success){
                    setState({type:"CHANGE_WH", payload:{value, id}})
                }else{
                    toast.error("Unknon error")
                }
            }
        }))
    }

    const changeSlsFirm = (id, value)=>{
        dispatch(post({
            url:`api/admin/change-sls-firm/${id}`,
            token,
            data:{value},
            action: (response)=>{
                if(response.success){
                    setState({type:"CHANGE_FIRM", payload:{value, id}})
                }else{
                    toast.error("Unknon error")
                }
            }
        }))
    }
    return (
        <Layout 
            header={<Header
                handleClick={()=>setState({type:"OPEN_MODAL", payload:""})}
            />
        }>
            <Form
                visible={state.visible}
                setCloseModal={()=>setState({type:"ClOSE_MODAL", payload:""})}
                form = {state.form}
                values = {state.values}
            />
            {state.loading 
            ? 
                <BgLoader loading={state.loading}/>
            :
                <div className="w-full h-full px-6 py-6 overflow-y-auto">
                    <Table>
                        <Head>
                        <Row>
                            <>
                                <Cell className="px-2 py-4 font-medium flex flex-row justify-center items-center">
                                    <span>ID</span>
                                </Cell>
                                <Cell className="px-2 py-4 font-medium flex flex-row justify-center items-center">
                                    <span>Name</span>
                                </Cell>
                                <Cell className="px-2 py-4 w-4 font-medium flex flex-row justify-center items-center">
                                    <span>Firm</span>
                                </Cell>
                                <Cell className="px-2 py-4 font-medium flex flex-row justify-center items-center">
                                    <span>Edit</span>
                                </Cell>
                            </>
                        </Row>
                        </Head>
                        <Body>
                            {state.data?.map(item => (
                                <Row key = {item.id}>
                                <>
                                    <Cell className="p-2">
                                        {item.id}
                                    </Cell>
                                    <Cell className="p-2">
                                        {item.name}
                                    </Cell>
                                    <Cell className="p-2 w-4">
                                        {/* {item.firm_id ? state.firms[item.firm_id] : ""} */}
                                        <Select
                                            onChange={(value)=>changeSlsFirm(item.id, value)}
                                            data = {state.firms?.length ? state.firms : [] }
                                            value = {item.firm_id}
                                        />
                                    </Cell>
                                    <Cell className="p-2 w-max-4">
                                        {/* {item.firm_id ? state.firms[item.firm_id] : ""} */}
                                        <Select
                                            onChange={(value)=>changeWh({id:item.id, value})}
                                            data = {state.warehouses?.length ? item.firm_id ? state.warehouses.filter(item2=>item.firm_id === item2.firm_id) : state.warehouses : [] }
                                            value = {item.wh_id}
                                        />
                                    </Cell>
                                    <Cell className="p-2">
                                        <IconButton handleClick={()=>setState({type:"EDIT_MODAL", payload:item})} icon={<BiEdit className="text-2xl"/>}/>
                                    </Cell>
                                </>
                                </Row>
                            ))}
                            
                        </Body>
                    </Table>
                </div>
            }
        </Layout>
    )
}

const Header = ({handleClick})=>(
    <div className="flex flex-row justify-between items-center">
    <div className="w-80">
        {/* <IconButton handleClick={handleClick} icon={<IoMdreAdd className="text-2xl"/>}/> */}
    </div>
</div>
) 

export default Managers;