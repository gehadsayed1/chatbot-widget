export function setCookie(name, value, hours = 24) {
  const maxAge = hours * 60 * 60;
  document.cookie = `${name}=${value}; max-age=${maxAge}; path=/`;
}

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export function deleteCookie(name) {
  document.cookie = `${name}=; max-age=0; path=/`;
}
