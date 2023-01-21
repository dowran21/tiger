import { useEffect, useReducer } from "react"
import BgLoader from "../../components/BgLoader"
import Layout from "../../components/Layout"
import { useDispatch, useSelector } from "react-redux"
import { get } from "../../application/middlewares"
import Table from "../../components/Table/Table"
import Head from "../../components/Table/Head"
import Row from "../../components/Table/Row"
import Cell from "../../components/Table/Cell"
import { toast } from "react-hot-toast"
import Body from "../../components/Table/Body"
import IconButton from "../../components/IconButton"
import {BiEdit} from "@react-icons/all-files/bi/BiEdit"
import Form from "./Form"
import { Link } from "react-router-dom"

function reducer(state, action){
    switch(action.type){
        case"set_LOADING":
            return {
                ...state
            }
        case "SET_DATA":
            return{
                ...state,
                data:action.payload
            }
        case "OPEN_MODAL":
            return {
                ...state,
                visible:true
            }
        case "CLOSE_MODAL":
            return {
                ...state,
                visible:false
            }
    }
}

function Clients (){

    const [state, setState] = useReducer(reducer,{
        loading:false, visible:false
    })
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(get({
            url:`/api/admin/get-clients`,
            token,
            action: (response) =>{
                if(response.success){
                    setState({type:"SET_DATA", payload:response.data.rows})
                }else{
                    toast.error("something went wrong")
                }
            }
        }))
    }, [])
    return (
        <Layout header={<Header/>}>
            {/* <Form
                visible={state.visible}
                setCloseModal = {()=>setState({type:"CLOSE_MODAL", payload:""})}
            /> */}
            <BgLoader state={state.loading}/>
            <div className="w-full h-full px-6 overflow-y-auto">
                <Table>
                    <Head>
                        <Row>
                            <>
                            <Cell>
                                <div className="px-2 py-4 font-medium flex flex-row justify-center items-center">
                                    <span>ID/LogicalRef</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className="px-2 py-4 font-medium flex flex-row justify-center items-center">
                                    <span>Name/Phone</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className="px-2 py-4 font-medium flex flex-row justify-center items-center">
                                    <span>Address</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className="px-2 py-4 font-medium flex flex-row justify-center items-center">
                                    <span>Firm</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className="px-2 py-4 font-medium flex flex-row justify-center items-center">
                                    <span>Position</span>
                                </div>
                            </Cell>
                            </>
                        </Row>
                    </Head>
                    <Body>
                        {state.data?.length ? 
                            state.data.map(item => 
                            <Row key={item.id}>
                                <>
                                <Cell className="p-2 flex justify-center items-center">
                                    {item.id+'/'+item.logical_ref}
                                </Cell>
                                <Cell className="p-2 flex justify-center items-center">
                                    {item.name} {item.phone_number ? `/${item.phone_number}` : ""}
                                </Cell>
                                <Cell className="p-2 flex justify-center items-center">
                                    {item.address}
                                </Cell>
                                <Cell className="p-2 flex justify-center items-center">
                                    {item.firm_name}
                                </Cell>
                                <Cell>
                                    <Link to={`/client/${item.id}`} >
                                        <IconButton handleClick={()=>console.log("hello world")} icon={<BiEdit className="text-2xl"/>}/>
                                    </Link>
                                    {/* <IconButton handleClick={()=>setState({type:"OPEN_MODAL", payload:""})} icon={<BiEdit className="text-2xl"/>}/> */}

                                </Cell>
                                </>
                            </Row>
                            
                            )
                            :
                            <></>
                    }
                    </Body>
                </Table>

            </div>
        </Layout>
    )
}

const Header = ()=>(
    <div>
        hello
    </div>
) 

export default Clients