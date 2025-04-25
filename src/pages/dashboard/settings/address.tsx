import {Input} from "../../../components/ui/input.tsx";
import {PrimaryButton} from "../../../components/PrimaryButton.tsx";
import {Textarea} from "../../../components/ui/textarea.tsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger
} from "../../../components/ui/select.tsx";

export const AddressSettings = () => {
    
    return (
        <div className="flex flex-col gap-16 items-center max-w-[32.563rem] mx-auto">
            <div className={'flex flex-col items-center gap-3'}>
                <div className={'w-16 h-16'}>
                    <img src={'/src/assets/dashboard/personal-details-icon.svg'} alt={'personal details'}/>
                </div>
                <p className={'font-glory text-2xl font-bold'}>Address Details</p>
            </div>
            <form className={'w-full'}>
                <div className={'grid gap-4'}>
                        <Textarea id="address" className={'w-full'} placeholder={'Enter your address'}/>
                        <Select>
                            <SelectTrigger className="w-full">
                                <span>{"Select a country"}</span>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Choose an Option</SelectLabel>
                                    <SelectItem value="option1">Option 1</SelectItem>
                                    <SelectItem value="option2">Option 2</SelectItem>
                                    <SelectItem value="option3">Option 3</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                </div>
                <div className={'mt-8'}>
                    <PrimaryButton>Update</PrimaryButton>
                </div>
            </form>
        </div>
    )
}
