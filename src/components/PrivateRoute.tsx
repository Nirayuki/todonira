import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/app-routes";

type PrivateRouteProps = {
    children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { push } = useRouter();

    const isUserAuthencitcated = localStorage.getItem("user");

    useEffect(() => {
        if(!isUserAuthencitcated){
            push(APP_ROUTES.public.home);
        }
    }, [isUserAuthencitcated]);

    return(
        <>
            {!isUserAuthencitcated && null}
            {isUserAuthencitcated && children}
        </>
    )
}

export default PrivateRoute;