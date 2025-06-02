import React, { useEffect, useState, useRef } from "react";
import { SIZE } from "@/constants/size";
import { Group, Stack, Text, TextInput } from "@mantine/core";
import { useSearchQuery } from "@/redux/api/search";
import { IconDatabaseOff, IconSearch } from "@tabler/icons-react";
import { motion } from "framer-motion";

const HeaderTop: React.FC = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [focus, setFocus] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const {
        data: dataSearch,
        refetch: refetchSearch,
    } = useSearchQuery({ q: searchText });

    const data = dataSearch?.data;

    useEffect(() => {
        refetchSearch();
    }, [searchText]);

    // Handle click outside để ẩn dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setFocus(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const renderCollection = () => {
        if (!data) {
            return (
                <Group h={100} align="center" justify="center" gap={12}>
                    <IconDatabaseOff size={36} />
                    <Text>Không có dữ liệu</Text>
                </Group>
            );
        }

        return (
            <>
                {data?.subjects?.hits?.map((item, idx) => {
                    const subject = item.document as Record<any, any>;
                    return <Text key={`subject-${idx}`}>{subject?.name}</Text>;
                })}
                {data?.departments?.hits?.map((item, idx) => {
                    const department = item.document as Record<any, any>;
                    return <Text key={`dept-${idx}`}>{department?.name}</Text>;
                })}
                {data?.profiles?.hits?.map((item, idx) => {
                    const profile = item.document as Record<any, any>;
                    return (
                        <Text key={`profile-${idx}`}>
                            {profile?.last_name} {profile?.first_name}
                        </Text>
                    );
                })}
                {data?.semsters?.hits?.map((item, idx) => {
                    const semster = item.document as Record<any, any>;
                    return <Text key={`sem-${idx}`}>{semster?.name}</Text>;
                })}
            </>
        );
    };

    return (
        <Group
            style={{
                height: SIZE.h_header,
                backgroundColor: "#0C0C0C",
                padding: 8,
            }}
        >
            <Group flex={1} maw={"40%"} pos={"relative"} ref={containerRef}>
                <TextInput
                    w={"100%"}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onFocus={() => setFocus(true)}
                    leftSection={<IconSearch />}
                    placeholder="Tìm kiếm"
                />

                {
                    focus && searchText.trim().length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                        >
                            <Stack
                                style={{
                                    width: "100%",
                                    maxHeight: 400,
                                    backgroundColor: "#0C0C0C",
                                    position: "absolute",
                                    zIndex: 100,
                                    top: 45,
                                    borderRadius: 4,
                                    padding: 8,
                                    overflow: "auto",
                                    boxShadow: "0px 0px 12px 0px rgba(255, 255, 255, 0.2)",
                                }}
                                align="center"
                                justify="center"
                            >
                                {renderCollection()}
                            </Stack>
                        </motion.div>
                    )}
            </Group>
        </Group>
    );
};

export default HeaderTop;
