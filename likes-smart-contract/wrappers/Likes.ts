import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
    Dictionary,
    TupleItemSlice,
} from '@ton/core';

export type LikesConfig = {
    admin: Address;
    totalLikes: number;
    likes: Dictionary<bigint, Cell>; // Dictionary of user hashes to cells
};

export function likesConfigToCell(config: LikesConfig): Cell {
    return beginCell()
        .storeAddress(config.admin)
        .storeUint(config.totalLikes, 32)
        .storeDict(config.likes)
        .endCell();
}

export const Opcodes = {
    like: 0x6c696b65, // 'like' in hex
    withdraw: 0x77697468, // 'with' in hex
};

export class Likes implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Likes(address);
    }

    static createFromConfig(config: LikesConfig, code: Cell, workchain = 0) {
        const data = likesConfigToCell(config);
        const init = { code, data };
        return new Likes(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            body: beginCell().endCell(),
        });
    }

    async sendLike(provider: ContractProvider, via: Sender, opts: { value: bigint }) {
        await provider.internal(via, {
            value: opts.value,
            body: beginCell()
                .storeUint(Opcodes.like, 32)
                .storeAddress(via.address) // Include sender's address
                .endCell(),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        });
    }

    async sendWithdraw(
        provider: ContractProvider,
        via: Sender,
        opts: { amount: bigint; value: bigint }
    ) {
        await provider.internal(via, {
            value: opts.value,
            body: beginCell()
                .storeUint(Opcodes.withdraw, 32)
                .storeCoins(opts.amount)
                .endCell(),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        });
    }

    async getTotalLikes(provider: ContractProvider): Promise<number> {
        const result = await provider.get('getTotalLikes', []);
        return result.stack.readNumber();
    }

    async hasLiked(provider: ContractProvider, userAddress: Address): Promise<boolean> {
        const userCell = beginCell().storeAddress(userAddress).endCell();
        const result = await provider.get('hasLiked', [{ type: 'slice', cell: userCell }]);
        return result.stack.readNumber() === 1;
    }

    // Optional: Method to get contract ID (e.g., address)
    getID(): Address {
        return this.address;
    }
}
