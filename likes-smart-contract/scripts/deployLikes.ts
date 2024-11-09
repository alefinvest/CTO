import { toNano, Address, Dictionary, Cell } from '@ton/core';
import { Likes } from '../wrappers/Likes';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const adminAddress = provider.sender().address as Address;

    const likesDict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());

    const likes = provider.open(
        Likes.createFromConfig(
            {
                admin: adminAddress, // Адміністратор — адреса розгортання
                totalLikes: 0,
                likes: likesDict, // Порожній словник
            },
            await compile('Likes')
        )
    );

    await likes.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(likes.address);

    console.log('Контракт успішно розгорнуто! => ID: ', likes.getID().toString());
}
