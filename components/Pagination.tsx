import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@chakra-ui/icons";
import {
    Box,
    Button,
    HStack,
    IconButton,
} from "@chakra-ui/react";

const ButtonPagination = ({
    children,
    index,
    setPageIndex,
    pageIndex,
}: {
    children: number,
    index: number,
    setPageIndex: Function,
    pageIndex: number,
}) => {
    return (
        <Button
            size="md"
            onClick={() => {
                setPageIndex(index);
            }}
            variant={pageIndex === index ? "round" : "link"}
        >
            {children}
        </Button>
    );
};

interface IProps {
    pageSize: number,
    pageIndex: number,
    setPageIndex: Function,
    totalItemsCount: number,
}

const Pagination = ({
    pageSize,
    pageIndex,
    setPageIndex,
    totalItemsCount,
}: IProps) => {

    const showButtons = () => {
        let buttons = [];

        const TOTAL_INDEX = Math.ceil(totalItemsCount / pageSize);

        if (TOTAL_INDEX < 5) {
            for (let index = 0; index < TOTAL_INDEX; index++) {
                buttons.push(
                    <ButtonPagination
                        key={index}
                        setPageIndex={setPageIndex}
                        index={index}
                        pageIndex={pageIndex}
                    >
                        {index + 1}
                    </ButtonPagination>
                );
            }
        }

        if (TOTAL_INDEX >= 5) {
            if (pageIndex < 3) {
                for (let index = 0; index <= 5; index++) {
                    buttons.push(
                        <ButtonPagination
                            key={index}
                            setPageIndex={setPageIndex}
                            index={index}
                            pageIndex={pageIndex}
                        >
                            {index + 1}
                        </ButtonPagination>
                    );
                }
            } else if (pageIndex >= TOTAL_INDEX - 2) {
                for (let index = TOTAL_INDEX - 5; index < TOTAL_INDEX; index++) {
                    buttons.push(
                        <ButtonPagination
                            key={index}
                            setPageIndex={setPageIndex}
                            index={index}
                            pageIndex={pageIndex}
                        >
                            {index + 1}
                        </ButtonPagination>
                    );
                }
            } else {
                for (let index = pageIndex - 2; index < pageIndex + 3; index++) {
                    buttons.push(
                        <ButtonPagination
                            key={index}
                            setPageIndex={setPageIndex}
                            index={index}
                            pageIndex={pageIndex}
                        >
                            {index + 1}
                        </ButtonPagination>
                    );
                }
            }
        }

        buttons.unshift(
            <IconButton
                aria-label='prev'
                icon={
                    <div className="border rounded-full w-10 h-10 flex items-center justify-center">
                        <ChevronLeftIcon boxSize={6} color="black" />
                    </div>
                }
                size="sm"
                onClick={() => {
                    setPageIndex(pageIndex - 1);
                }}
                isDisabled={!(pageIndex > 0)}
                variant="link"
                key='prev'
            >
                Atras
            </IconButton>
        );

        buttons.push(
            <IconButton
                aria-label='next'
                icon={
                    <div className="border rounded-full w-10 h-10 flex items-center justify-center">
                        <ChevronRightIcon boxSize={6} color="black" />
                    </div>}
                size="sm"
                onClick={() => {
                    setPageIndex(pageIndex + 1);
                }}
                isDisabled={!(pageIndex + 1 < TOTAL_INDEX)}
                variant="link"
                key='next'
            >
                Atras
            </IconButton>
        );

        return buttons;
    };

    return (
        <div>
            <HStack w="100%" p={2}>
                <Box w="60%" justifyContent="right" display="flex" className="mx-auto">
                    <HStack className="mx-auto">{showButtons()}</HStack>
                </Box>
            </HStack>
        </div>
    );
};

export default Pagination;
