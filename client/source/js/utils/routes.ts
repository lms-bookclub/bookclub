export function extractCurrentPath(component): string {
  return component.props.router.getCurrentLocation().pathname;
}