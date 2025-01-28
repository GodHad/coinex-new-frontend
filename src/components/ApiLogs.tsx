import { HistoryType } from "@/types/history";
import { Tooltip } from "./Tooltip";
// import { Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { Pagination } from "@/types/pagination";
import { getHistories } from "@/utils/api";
import { Webhook } from "@/types/hooks";
import moment from "moment";
import DebouncedInput from "./common/DebouncedInput";
import ReactPagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';

const APILogs = ({ isPremium }: { isPremium: boolean }) => {
    const [histories, setHistories] = useState<HistoryType[]>([]);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    // const [isLoading, setIsLoading] = useState<boolean>(false);

    const formatJson = (json: string) => {
        try {
            return JSON.stringify(JSON.parse(json), null, 2);
        } catch {
            return json;
        }
    };

    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        perPage: 10,
        totalItems: 0,
        totalPages: 0
    })  ;

    const handleGetHistories = async () => {
        // setIsLoading(true);
        const result = await getHistories({
            perPage: pagination.perPage, 
            currentPage: pagination.currentPage,
            searchTerm: globalFilter
        });

        if (result) {
            setHistories(result.histories);
            setPagination(result.pagination);
        }
        // setIsLoading(false);
    }
    
    useEffect(() => {
        handleGetHistories();
    }, [pagination.perPage, pagination.currentPage, globalFilter]);

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold">API Activity Logs</h2>
                        <Tooltip content="Detailed logs of all API calls made by your webhooks">
                        </Tooltip>
                    </div>
                    {/* {!isPremium && (
                        <span className="text-sm text-gray-500">
                            Limited to last 24 hours (Upgrade for full history)
                        </span>
                    )} */}
                </div>
            </div>
            <div className="flex sm:flex-row flex-col sm:items-center justify-between mt-4 mb-4 items-start gap-1 px-4">
                <div className="flex items-center gap-1 ">
                    Show
                    <select
                        className="flex h-10 w-full items-center justify-center rounded-xl border bg-white/0 px-3 text-sm outline-none"
                        value={pagination.perPage}
                        onChange={e => {
                            setPagination(prev => ({
                                ...prev,
                                perPage: Number(e.target.value)
                            }))
                        }}
                    >
                        {[10, 25, 50, 100].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    entries
                </div>
                <div className="flex items-center gap-1">
                    Search:
                    <DebouncedInput
                        type="text"
                        value={globalFilter}
                        onChange={value => setGlobalFilter(value.toString())}
                        placeholder={``}
                        className="flex h-10 w-full items-center justify-center rounded-xl border bg-white/0 text-sm outline-none"
                    />
                </div>
            </div>
            <div className="divide-y divide-gray-100">
                {histories.map((history) => (
                    <div key={history._id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <span className="font-medium">{(history.hook as Webhook).name || 'Unknown Webhook'}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${history.data?.code === 0
                                    ? 'bg-green-100 text-green-800'
                                    // : history.status >= 400 && history.status < 500
                                    //     ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {'POST'} {history.data?.code}
                                </span>
                                <span className="text-sm text-gray-500">{'https://api.coinex.com/v2/futures/order'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* <span className="text-sm text-gray-500">{history.duration}ms</span> */}
                                <span className="text-sm text-gray-500">{moment(history.createdAt).format('YYYY-MM-DD hh:mm:ss')}</span>
                            </div>
                        </div>
                        {isPremium && (
                            <div className="mt-2 space-y-2">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm font-medium text-gray-700 mb-1">Request</p>
                                        <pre className="text-sm text-gray-600 overflow-x-auto">
                                            {formatJson(JSON.stringify({
                                                symbol: history.symbol,
                                                side: history.action,
                                                amount: history.amount,
                                                type: 'market'
                                            }))}
                                        </pre>
                                    </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Response</p>
                                    <pre className="text-sm text-gray-600 overflow-x-auto">
                                        {formatJson(JSON.stringify(history.data))}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {histories.length > 0 ?
                <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between mt-4 gap-1 px-4">
                    <div className="col-sm-12 col-md-5">
                        <div
                            className="dataTables_info"
                            id="membershipsDataTable_info"
                            role="status"
                            aria-live="polite"
                        >
                            {`Showing ${((pagination.currentPage - 1) * pagination.perPage + 1)} to ${Math.min(pagination.currentPage * pagination.perPage, pagination.totalItems)} of ${pagination.totalItems} entries`}
                        </div>
                    </div>

                    <div className="col-sm-12 col-md-7">
                        {pagination.totalItems > 0 && (
                            <div className="flex items-center justify-end gap-2">
                                <ReactPagination
                                    current={pagination.currentPage}
                                    total={pagination.totalPages}
                                    onPageChange={(page) => {
                                        setPagination(prev => ({ ...prev, currentPage: page }));
                                    }}
                                    maxWidth={5}
                                    previousLabel="Previous"
                                    nextLabel="Next"
                                />
                            </div>
                        )}
                    </div>
                </div>
                :
                <div className="w-full gap-1 px-4 py-4 text-center">
                    No logs
                </div>
            }
            {/* {!isPremium && (
                <div className="p-6 bg-gradient-to-b from-transparent to-gray-50 text-center border-t border-gray-100">
                    <div className="max-w-xl mx-auto">
                        <h3 className="text-lg font-semibold mb-2">Unlock Detailed API Logs</h3>
                        <p className="text-gray-600 mb-4">
                            Get access to complete request/response data and full API history with Premium.
                        </p>
                        <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-2 rounded-md hover:from-yellow-500 hover:to-yellow-700 transition-all shadow-md inline-flex items-center gap-2">
                            <Crown className="w-4 h-4" />
                            Upgrade to Premium
                        </button>
                    </div>
                </div>
            )} */}
        </div>
    )
};

export default APILogs;