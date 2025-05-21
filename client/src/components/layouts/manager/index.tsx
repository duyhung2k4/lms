import React, { Suspense, useEffect, useMemo, useState } from "react";

import { Outlet, useNavigate } from "react-router";
import { ActionIcon, Avatar, Box, Group, LoadingOverlay, Stack, Text } from '@mantine/core';
import { ROUTER } from "@/constants/routes";
import { IconBrandDatabricks, IconSquareArrowLeftFilled, IconSquareArrowRightFilled } from "@tabler/icons-react";
import { SIZE } from "@/constants/size";
import type { TypeInfoRoute } from "@/constants/routes";

import classes from "./styles.module.css";



const AppshellLayout: React.FC = () => {
  const [show, setShow] = useState<boolean>(true);
  const [showText, setShowText] = useState<boolean>(true);

  const links: TypeInfoRoute[] = useMemo(() => {
    let list: TypeInfoRoute[] = [
      ROUTER.DASHBOARD,
      ROUTER.MANAGER_CENTIFICATE,
      ROUTER.MANAGER_DEPARTMENT,
      ROUTER.MANAGER_TEACHER,
    ];

    return list;
  }, []);

  const navigation = useNavigate();

  const pathname = window.location.pathname;

  const handleNavigation = (href: string) => {
    navigation(href);
  }

  // const handleLogout = () => {
  //     Cookies.remove(TOKEN_TYPE.ACCESS_TOKEN);
  //     Cookies.remove(TOKEN_TYPE.REFRESH_TOKEN);

  //     navigation(ROUTER.HOME.href);
  // }

  useEffect(() => {
    if (!show) {
      setShowText(false);
      return;
    };

    const showTextLinkTimeOut = setTimeout(() => {
      setShowText(true);
    }, 200);

    return () => {
      clearTimeout(showTextLinkTimeOut);
    }
  }, [show]);

  const BoxShow: React.FC<{ children: React.ReactNode }> = (props) => {
    return (
      <>
        {
          show &&
          (showText &&
            props.children)
        }
      </>
    )
  }



  return (
    <Suspense fallback={<LoadingOverlay visible overlayProps={{ radius: "sm", blur: 2 }} />}>
      <Group h={"100vh"} w={"100%"} gap={0}>
        <Stack className={classes.nav} w={show ? SIZE.w_navbar : SIZE.w_navbar_mini} gap={0}>
          <Group p={16} pb={36}>
            <IconBrandDatabricks />
            <BoxShow>
              <Text><span className={classes.title_app}>L</span>MS</Text>
            </BoxShow>
          </Group>
          <Stack className={classes.links}>

            {
              links.map((l, i) => {
                const Icon = l.icon;
                const active = l.href === pathname;

                return (
                  <Group
                    key={i}
                    className={`${classes.link_root} ${active ? classes.active_link : null}`}
                    gap={0} w={"100%"}
                    onClick={() => handleNavigation(l.href)}
                  >
                    <Box className={classes.line_link}></Box>
                    <Group className={classes.link} gap={0}>
                      <Group
                        w={show ? "90%" : "100%"}
                        gap={0}
                        className={classes.group_text}
                        style={{
                          borderTopRightRadius: show ? "8px" : "0px",
                          borderBottomRightRadius: show ? "8px" : "0px",
                        }}
                      >
                        <Group justify="center" align="center" style={{ flex: 1 }} pt={8} pb={8} pl={16} pr={16}>
                          {Icon && <Icon />}
                        </Group>
                        <BoxShow>
                          <Box className={classes.text_link}>{l.name}</Box>
                        </BoxShow>
                      </Group>
                    </Group>
                  </Group>
                )
              })
            }


          </Stack>
          <Group p={16} justify={show ? "start" : "center"} align="center">
            <Avatar radius="xl" />
            <BoxShow>
              <Text>Admin</Text>
            </BoxShow>
          </Group>

          <ActionIcon
            style={{
              position: "absolute",
              cursor: "pointer",
              bottom: "60px",
              right: "-29px",
              padding: "0",
              color: "#FFF",
              zIndex: 10,
              backgroundColor: "#151517"
            }}
            variant="subtle"
            size={32}
            onClick={() => setShow(!show)}
          >
            {show ?
              <IconSquareArrowLeftFilled size={32} />
              :
              <IconSquareArrowRightFilled size={32} />
            }
          </ActionIcon>
        </Stack>
        <Group
          style={{
            maxHeight: "100vh",
            height: "100%",
            justifyContent: "start",
            alignItems: "start",
            flex: 1,
            padding: 0,
            overflow: "hidden",
          }}
        >
          <Outlet />
        </Group>
      </Group>
    </Suspense>
  )
}

export default AppshellLayout;