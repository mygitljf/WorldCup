import { createSeedState } from "@/data/mock-seed"
import { InMemoryGameStore } from "./in-memory-game-store"

const appStore = new InMemoryGameStore(createSeedState())

export function getAppStore(): InMemoryGameStore {
  return appStore
}
