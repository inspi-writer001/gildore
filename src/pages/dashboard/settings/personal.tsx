import {Input} from "../../../components/ui/input.tsx";
import {PrimaryButton} from "../../../components/PrimaryButton.tsx";

export const DashboardSettingsPersonal = () => {
    return (
        <div className="flex flex-col gap-16 items-center max-w-[32.563rem] mx-auto">
           <div className={'flex flex-col items-center gap-3'}>
               <div className={'w-16 h-16'}>
                   <img src={'/src/assets/dashboard/personal-details-icon.svg'} alt={'personal details'} />
               </div>
                <p className={'font-glory text-2xl font-bold'}>Personal Details</p>
           </div>
            <form className={'w-full'}>
                <div className={'grid grid-cols-2 gap-4'}>
                    <div className={'flex flex-col gap-2'}>
                        <Input type="text" id="first-name" placeholder={'Enter your first name'}/>
                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <Input type="text" id="last-name" placeholder={'Enter your last name'}/>
                    </div>
                    <div className={'flex flex-col col-span-2 gap-2'}>
                        <Input type="email" id="email" placeholder={'Enter your email'}/>
                    </div>
                </div>
                <div className={'mt-8'}>
                    <PrimaryButton>Update</PrimaryButton>
                </div>
            </form>
        </div>
    );
};
