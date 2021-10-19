const IPLibrary = []
const IPLibraryLength = 10

for(let i = IPLibraryLength; i > 0; i--) {
  IPLibrary.push(`193.112.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`)
}

export function randomIP () {
  return IPLibrary[Math.floor(Math.random() * IPLibrary.length)]
}

export function random (n = 9999) {
  return Math.floor(Math.random() * n)
}

export function randomRange (min, max) {
  return Math.random() * (max - min) + min
}