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
import { get } from "../../application/middlewares";
import { toast } from "react-hot-toast";
import { BiEdit } from "@react-icons/all-files/bi/BiEdit";

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
        default: 
            return {
                ...state
            }
    }
}

function Operators (){

    const [state, setState] = useReducer(reducer, {
        data:[], loading:false, visible:false, values:{}
    })
    const token = useSelector(state=>state.auth.token)
    const dispatch = useDispatch()
    const roles = {
        3:"Supervisor",
        2:"Moderator",
    }
    useEffect(()=>{
        dispatch(get({
            url:`api/admin/get-users`,
            token,
            action: (response) =>{
                if(response.success){
                    setState({type:"SET_DATA", payload:response.data})
                }else{
                    toast.error("Unknown error")
                }
            }
        }))
    }, [])

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
                                <Cell className="px-2 py-4 font-medium flex flex-row justify-center items-center">
                                    <span>Role</span>
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
                                    <Cell className="p-2">
                                        {roles[+item.role_id]}
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
        <IconButton handleClick={handleClick} icon={<IoMdAdd className="text-2xl"/>}/>
    </div>
</div>
)

export default Operators;