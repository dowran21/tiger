import { useEffect, useReducer } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { get } from '../../application/middlewares';
import Table from '../../components/Table/Table';
import Head from '../../components/Table/Head';
import Body from '../../components/Table/Body';
import Row from '../../components/Table/Row';
import Cell from '../../components/Table/Cell';
import NoContent from '../../components/NoContent';
import toast from 'react-hot-toast';
import BgLoader from '../../components/BgLoader';
import Layout from "../../components/Layout";
import SearchInput from '../../components/SearchInput';
import MyPagination from '../../components/Pagination';


function reducer(state, action) {
    console.log(action)
    switch (action.type){
        case "SET_DATA":{
            return {    
                ...state,
                count:+action.payload?.count,
                data:action.payload?.logs,
                loading:false,
            }
        }
        case "SET_SEARCH":{
            return {
                ...state,
                trigger:!state.trigger,
                page:0,
                search:action.payload,
                loading:true
            }
        }
        case "SET_PAGE":{
            return{
                ...state,
                trigger:!state.trigger,
                page:action.payload,
                loading:true
            }
        }
        case "SET_START_DATE":{
            return{
                ...state, 
                trigger:!state.trigger,
                page:0,
                start_date:action.payload,
                loading:true
            }
        }
        case "SET_END_DATE":{
            return {
                ...state,
                trigger:!state.trigger,
                page:0,
                end_date:action.payload,
                loading:true
            }

        }
        case "SET_LIMIT":{
            return{
                ...state,
                trigger:!state.trigger,
                page:0,
                loading:true,
                limit:action.payload
            }
        }
        default: return state
    }
}


function Logs (){
    const dispatch = useDispatch()
    const [state, setState] = useReducer(reducer, { 
        data:[], loading:true, search:"", trigger:false, count:0,
        sort_column:"id", sort_direction:"ASC", page:0, limit: 30,
        start_date:"",end_date:""
    });
    const token = useSelector(state => state.auth.token);
    useEffect(() => {
        dispatch(get({
            url: `api/admin/get-logs?page=${state.page}&limit=${state.limit}&search=${state.search}&start_date=${state.start_date}&end_date=${state.end_date}`,
            token,
            action:(response) =>{
                console.log(response)
                if(response.success){
                    setState({type:"SET_DATA", payload:{...response.data.rows}});
                    console.log(state)
                }else{
                    toast.error("Неизвестная ошибка")
                }
            }
        }))
    }, [state.page, state.trigger])

    const handleSearch = (value) =>{
        setState({type:"SET_SEARCH", payload:value})
    }
    

    return (
        <Layout header = {<Header handleSearch = {handleSearch} hanldeStartDate = {(value) => setState({type:"SET_START_DATE", payload:value})} hanldeEndDate = {(value) => setState({type:"SET_END_DATE", payload:value})}/>} footer = {<MyPagination setPage = {(value) => setState({type:"SET_PAGE", payload:value})} setLimit = {(value) => setState({type:"SET_LIMIT", payload:value})} limit = {+state.limit} count = {+state.count} page = {+state.page}/>}>
            
            <BgLoader loading = {state.loading}/>
            <div className="w-full h-full px-6 overflow-y-auto pb-5">
                <Table>
                    <Head>
                        <Row>
                            <>
                            <Cell>
                                <div className={` 'text-blue-500'  px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>ID</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={` 'text-blue-500'  px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>Оператор</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={` 'text-blue-500'  px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>Номер</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={` 'text-blue-500'  px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>Время активации</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={` 'text-blue-500'  px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>Активация</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={` 'text-blue-500'  px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>Комментари</span>
                                </div>
                            </Cell>
                            </>
                        </Row>
                    </Head>
                        <Body>
                        {state.data?.length>0 ?
                            state.data.map(item =>(
                                <Row key = {item.log_id}>
                                    <>
                                    <Cell>
                                        <div className = "p-2 w-12">
                                            {item.real_estate_id}
                                        </div>
                                    </Cell>
                                    <Cell>
                                        <div className = "p-2">
                                            {item.full_name}
                                        </div>
                                    </Cell>
                                    <Cell>
                                        <div className = "p-2">
                                        +993 {item?.phone.substring(0, 2)} {item?.phone.substring(2, )}
                                        </div>
                                    </Cell>
                                    <Cell>
                                        <div className = "p-2">
                                            {item.time}
                                        </div>
                                    </Cell>
                                    <Cell>
                                        <div className = "p-2">
                                            {item.activation ? "Подтвердили" : "Отказали"}
                                        </div>
                                    </Cell>
                                    <Cell>
                                        <div className = "p-2">
                                            {item.comment ? `${item.comment}` : "Нет комментария"}
                                        </div>
                                    </Cell>
                                    </>
                                </Row>
                            ))
                            :
                            
                            state.loading === true ? null :
                                <tr>
                                    <td colSpan="10" >
                                        <div className="flex w-full h-full py-20 justify-center items-center">
                                            <NoContent title="Нет Локаций"/>
                                        </div>
                                    </td>
                                </tr>
                            }
                        </Body>
                </Table>
            </div>
        </Layout>
    )
}


const Header = ({handleSearch, hanldeStartDate, hanldeEndDate}) =>{
    return (
    <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row w-4/5">
            <div className = "w-1/3"> 
                <SearchInput action={(value) => handleSearch(value)} placeholder="Поиск"/>
            </div>
            <div className = "pl-3 w-1/3">
                <input type = "text" onFocus = {(e)=>{e.currentTarget.type="date"}} onBlur={(e)=>e.currentTarget.type="text"} onChange = {(e)=>hanldeStartDate(e.target.value)} placeholder = "Введите начальное число" className = "w-1/3 pr-4 pl-15 h-10 text-gray-700 rounded-2xl appearance-none w-full bg-white shadow-sm placeholder-gray-400 focus:shadow-inner text-sm focus:outline-none pl-10"/>
            </div>
            <div className = "pl-3 w-1/3">
                <input type = "text" onFocus = {(e)=>{e.currentTarget.type="date"}} onBlur={(e)=>e.currentTarget.type="text"} onChange = {(e)=>hanldeEndDate(e.target.value)} placeholder = "Введите конечное число" className = "w-1/3 pr-4 pl-15 h-10 text-gray-700 rounded-2xl appearance-none w-full bg-white shadow-sm placeholder-gray-400 focus:shadow-inner text-sm focus:outline-none pl-10"/>
            </div>
        </div>
    </div>
    )
};


export default Logs