import { Popover } from "flowbite-react"

export function PopoverPassword({ children }){
    return(
        <Popover
            trigger="hover"
            content={
            <div className="space-y-2 p-3 bg-amber-100 border-2 dark:border-white">
                <h3 className="font-semibold text-gray-900">Must have at least 8 characters</h3>
                <ul>
                <li className="mb-1 flex items-center">
                    Upper & lower case letters
                </li>
                <li className="mb-1 flex items-center">
                    2 digits
                </li>
                </ul>
            </div>
                }>
            <div>{children}</div>
        </Popover>
    )
}

export default PopoverPassword