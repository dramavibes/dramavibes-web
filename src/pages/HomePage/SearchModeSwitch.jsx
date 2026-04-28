import {Tabs} from "@heroui/react";
import { SearchIcon, SparklesIcon } from "lucide-react";

export default function SearchModeSwitch({ searchMode, setSearchMode, className = "" }) {
    return (
        <Tabs className={`w-full max-w-md ${className}`} selectedKey={searchMode} onSelectionChange={key => setSearchMode(key)}>
            <Tabs.ListContainer>
                {/* w-fit *:h-6 *:w-fit *:px-3 *:text-sm *:font-normal *:data-[selected=true]:text-accent-foreground */}
                <Tabs.List aria-label="Options" className="rounded-full *:text-[16px] *:font-normal *:py-6 *:pt-6.5 *:data-[selected=true]:text-accent-foreground">
                    <Tabs.Tab id="vibe">
                        <div>
                            <div className="flex items-center gap-2">
                                <SparklesIcon className="-mb-2" />
                                Vibe Search
                            </div>
                            <div className="text-[10px] opacity-60">Search by feel</div>
                        </div>
                        <Tabs.Indicator className="bg-accent rounded-full" />
                    </Tabs.Tab>
                    <Tabs.Tab id="classic">
                        <div>
                            <div className="flex items-center gap-1.5">
                                <SearchIcon className="-mb-2" />
                                Classic Search
                            </div>
                            <div className="text-[10px] opacity-60">Search by title</div>
                        </div>

                        <Tabs.Indicator className="bg-accent rounded-full" />
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs.ListContainer>
        </Tabs>
    )
}