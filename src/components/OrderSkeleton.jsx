export default function OrdersSkeleton() {
    return (
        <main className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-64 mb-8" />

                <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                {[...Array(7)].map((_, i) => (
                                    <th key={i} className="px-4 py-3">
                                        <div className="h-4 bg-gray-200 rounded w-20" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, i) => (
                                <tr key={i} className="border-b">
                                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-12" /></td>
                                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-40" /></td>
                                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                                    <td className="px-4 py-4"><div className="h-8 bg-gray-200 rounded-full w-20" /></td>
                                    <td className="px-4 py-4"><div className="h-8 bg-gray-200 rounded w-16" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}