"use client"

import * as React from "react"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { WorkspacesSwitcher } from "./workspace-switcher"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { Access, useAuthAdmin } from "@/context/auth-context"
import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react"

const dataAdmin = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true
    },
    {
      title: "Pacientes",
      url: "#",
      icon: Bot
    },
    {
      title: "Profissionais",
      url: "#",
      icon: Bot
    },
    {
      title: "Consultas",
      url: "#",
      icon: BookOpen
    },
    {
      title: "Financeiro",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
    },
  ],
}

const dataAdminProfissional = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Meu painel",
          url: "#",
        },
        {
          title: "Geral",
          url: "#",
        }
      ],
    },
    {
      title: "Pacientes",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Meus pacientes",
          url: "#",
        },
        {
          title: "Geral",
          url: "#",
        }
      ],
    },
    {
      title: "Consultas",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Minhas consultas",
          url: "#",
        },
        {
          title: "Geral",
          url: "#",
        },
      ],
    },
    {
      title: "Profissionais",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Financeiro",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
    },
  ],
}

const dataProfissional = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true
    },
    {
      title: "Pacientes",
      url: "#",
      icon: Bot
    },
    {
      title: "Consultas",
      url: "#",
      icon: BookOpen
    },
    {
      title: "Financeiro",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
    },
  ],
}

const dataPaciente = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal
    },
    {
      title: "Consultas",
      url: "#",
      icon: BookOpen
    },
    {
      title: "Autoavaliações",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Diários",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
    },
  ],
}


export function AppSidebar({ role, access, ...props }: React.ComponentProps<typeof Sidebar> & { role?: string, access?: Access }) {
  const { user } = useAuthAdmin();
  const data = role === 'ADMIN' ? dataAdmin : role === 'HYBRID' ? dataAdminProfissional : role === 'PROFFESSIONAL' ? dataProfissional : dataPaciente;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspacesSwitcher workspaceSelecionado={access} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user!} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
