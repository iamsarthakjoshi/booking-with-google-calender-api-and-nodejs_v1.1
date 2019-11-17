import path from 'path'

const node_path = process.env.NODE_PATH

export const TOKEN_PATH = path.join(node_path, '/common/token.json')
