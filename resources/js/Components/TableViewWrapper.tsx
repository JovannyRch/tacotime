interface Props {
    children: React.ReactNode;
    title?: string;
    actions?: React.ReactNode;
}

const TableViewWrapper = ({ children, title, actions }: Props) => {
    return (
        <>
            <div className="mb-6 flex min-h-12 items-center justify-between">
                <h2 className="text-2xl font-semibold">{title}</h2>
                {actions}
            </div>

            <div className="space-y-2">{children}</div>
        </>
    );
};

export default TableViewWrapper;
