import { ROUTES } from '../constants/index.js'

class Routes {
  static getRoutes() {
    return ROUTES
  }

  static getRoutePath(routeName) {
    return ROUTES[routeName] || ROUTES.INTRO
  }

  static navigate(routeName, navigateFn) {
    const path = this.getRoutePath(routeName)
    if (navigateFn) {
      navigateFn(path)
    }
  }
}

export default Routes
