import { lazy } from "react"
// import { TiBusinessCard } from "@react-icons/all-files/ti/TiBusinessCard";
import { MdMergeType } from "@react-icons/all-files/md/MdMergeType";
import { TiLocationOutline } from "@react-icons/all-files/ti/TiLocationOutline";
import { HiOutlinePhotograph } from "@react-icons/all-files/hi/HiOutlinePhotograph"; 
import { MdBusiness } from "@react-icons/all-files/md/MdBusiness";
// import { RiVipCrown2Line } from "@react-icons/all-files/ri/RiVipCrown2Line";
// import { BiUserPin } from "@react-icons/all-files/bi/BiUserPin";
import { BiSupport } from "@react-icons/all-files/bi/BiSupport";
import { FaRegChartBar } from "@react-icons/all-files/fa/FaRegChartBar";
import { GoSettings } from "@react-icons/all-files/go/GoSettings";
import {FaUsers} from "@react-icons/all-files/fa/FaUsers"
// import {AiOutlineFileText} from "@react-icons/all-files/ai/AiOutlineFileText"
// import {MdLocationOff} from "@react-icons/all-files/md/MdLocationOff"
// import {MdNotificationsActive} from "@react-icons/all-files/md/MdNotificationsActive"
// import {GrCompliance} from "@react-icons/all-files/gr/GrCompliance"
// import {HiTranslate} from "@react-icons/all-files/hi/HiTranslate"
// import {SiPostgresql} from "@react-icons/all-files/si/SiPostgresql"
// import {AiOutlineUsergroupDelete} from "@react-icons/all-files/ai/AiOutlineUsergroupDelete"
 
const Users = lazy(() => import('./Users'));
const Clients = lazy (()=>import("./Clients"))
const Operators = lazy(()=>import("./Operators"));
const Managers = lazy (()=>import("./Managers"))

export const routes = [


    {id:2, roles:{1:true}, index:false, link:"operators", path:"operators", title:"Operatory", element:<Operators/>, icon:MdBusiness},
    {id:3, roles:{1:true, 2:true}, index:false, link:'managers', path:'managers', title: 'managers', element:<Managers/>, icon:FaUsers},
    {id:4, roles:{1:true, 2:true}, index:false, link:'clients', path:'clients', title: 'Clients', element:<Clients/>, icon:FaUsers},



];
