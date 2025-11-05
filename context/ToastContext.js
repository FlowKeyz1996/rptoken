import React, { createContext, useContext } from "react";
import toast, {Toaster} from "react-hot-toast";



const ToastContext = createContext();

const BRAND_COLOR = "13101A";
const TOAST_STYLE ={
    common:{
        background: BRAND_COLOR,
        color:"white",
        padding:"16px",
        boxShadow:"0 2px 10px rgba(0, 0, 0, 0.15)",
    },

    processing:{
        borderLeft:"4px solid #facc15",
    },
    approve:{
        borderLeft:"4px solid #22c55e",
    },
    complete:{
        borderLeft: "4px solid #22c55e"
    },
    reject:{
        borderLeft:"4px solid #ef4444"
    },
    failed:{
        borderLeft:"4px solid #f97316"
    },
    info:{
        borderLeft: "4px solid #2ed3co"
    },
}


export const ToastProvider = ({children}) => {
    const showProcessing = (Message) =>{
        return toast.loading(Message, {
            style:{
                ...TOAST_STYLE.common,
                ...TOAST_STYLE.complete,

            },
            duration: 5000,

        });
    };
    const showApprove = (Message) =>{
        return toast.success(Message, {
            style:{
                ...TOAST_STYLE.common,
                ...TOAST_STYLE.approve,

            },
            icon:"🎉",
            duration: 5000,

        });
    };
    const showComplete = (Message) =>{
        return toast.success(Message, {
            style:{
                ...TOAST_STYLE.common,
                ...TOAST_STYLE.complete,

            },
            icon:"🎉",
            duration: 5000,

        });
    };
    const showReject = (Message) =>{
        return toast.error(Message, {
            style:{
                ...TOAST_STYLE.common,
                ...TOAST_STYLE.reject,

            },
           
            duration: 5000,

        });
    };
    const showFailed = (Message) =>{
        return toast.error(Message, {
            style:{
                ...TOAST_STYLE.common,
                ...TOAST_STYLE.failed,

            },
            icon:"Error",
            duration: 5000,

        });
    };
    const showInfo = (Message) =>{
        return toast.error(Message, {
            style:{
                ...TOAST_STYLE.common,
                ...TOAST_STYLE.failed,

            },
            icon:"🎉",
            duration: 4000,

        });
    };

    const updateToast = (id, state, message) => {
        toast.dimiss(id);

        switch(state){
            case "processing":
            return showProcessing(message);

            case "approve":
                return showApprove(message);
            case "complete":
                return showComplete(message);
                case "reject":
                    return showReject(message);
                    case "failed":
                        return showFailed(message);
                        case"info":
                        return showInfo(message);
        }
    };

    const notify ={
        start:(message = "Processing Transaction ..")=>{
            return showProcessing(message);

        },
        update:(id, state, message)=>{
            return updateToast(id, state, message);
        },

        approve:(id, message = "Transaction Approved") => {
            return updateToast(id, "Approve", message);
        
        },
        complete:(id, message = "Transaction Completed successfully") =>{
            return updateToast(id, "complete", message);
        },
        reject:(id, message ="Transaction has been Rejected")=>{
            return updateToast(id, "reject", message);

            
        },
        failed:(id, message ="Transaction has Failed")=>{
            return updateToast(id, "failed", message);
        }
    };

    return <ToastContext.Provider value={{
        showProcessing,
        showApprove,
        showComplete,
        showReject,
        showFailed,
        showInfo,
        updateToast,
        notify,
        toast,
    }}>
        <Toaster position ="bottom-right" toastOptions={{
            success:{
                iconTheme:{
                    primary:"#22c55e",
                    secondary:"white",


                }
            },
            error:{
                iconTheme:{
                    primary:"ef4444",
                    secondary:"white",
                },
            },
        }}/>
        {children}

    </ToastContext.Provider>

};

export const useToast = () =>{
 const context = useContext(ToastContext);

 if(context === undefined){
  throw new Error(`Toast must be used within Toast provider`);
 }
 return context
}