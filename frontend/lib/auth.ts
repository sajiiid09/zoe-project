export interface RoleAwareUser {
  role: string
  vendorFeePaid?: boolean
  affiliateFeePaid?: boolean
}

export const getPaymentRouteForRole = (role?: string | null) => {
  if (role === "VENDOR") {
    return "/vendor-payment"
  }

  if (role === "AFFILIATE") {
    return "/affiliate-payment"
  }

  return null
}

export const getDashboardRouteForRole = (role?: string | null) => {
  if (role === "ADMIN") {
    return "/admin"
  }

  if (role === "VENDOR") {
    return "/vendor"
  }

  if (role === "AFFILIATE") {
    return "/affiliate"
  }

  return "/profile"
}

export const getDefaultRouteForUser = (user?: RoleAwareUser | null) => {
  if (!user) {
    return "/"
  }

  if (user.role === "VENDOR" && !user.vendorFeePaid) {
    return "/vendor-payment"
  }

  if (user.role === "AFFILIATE" && !user.affiliateFeePaid) {
    return "/affiliate-payment"
  }

  if (user.role === "CUSTOMER") {
    return "/"
  }

  return getDashboardRouteForRole(user.role)
}

export const getRoleLabel = (role?: string | null) => {
  if (role === "ADMIN") {
    return "Admin"
  }

  if (role === "VENDOR") {
    return "Vendor"
  }

  if (role === "AFFILIATE") {
    return "Affiliate"
  }

  return "Customer"
}
