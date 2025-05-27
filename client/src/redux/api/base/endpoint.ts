import { METHOD_QUERY } from "@/constants/method"

const headers = {
  publicHeader: () => {
    return {
      'Content-Type': 'application/json'
    }
  }
}

export const endpoint = {
  base: {
    query: {
      url: "api/base/query",
      method: METHOD_QUERY.POST,
      headers: headers.publicHeader(),
    },
    filter: {
      url: "api/base/filter",
      method: METHOD_QUERY.GET,
      headers: headers.publicHeader(),
    }
  },
  profile: {
    createTeacher: {
      url: "api/profile/account-teacher",
      method: METHOD_QUERY.POST,
      headers: headers.publicHeader(),
    }
  },
  subject: {
    generateSectionClasses: {
      url: "api/subject/section-classes/generate",
      method: METHOD_QUERY.POST,
      headers: headers.publicHeader(),
    }
  }
}