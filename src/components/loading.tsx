import { Triangle } from  'react-loader-spinner'

export const LoadingTriangle = (props: {size?: number | string}) => {
    return (
        <div role="status">
            <Triangle
                height={ props.size ?? 40 }
                width={ props.size ?? 40 }
                color='rgb(168 85 247)'
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                visible={true}
            />
        </div>
    )
}

export const LoadingPage = () => {
    return (
        <div className='h-screen w-full flex justify-center items-center'>
            <LoadingTriangle size={80} />
        </div>
    )
}