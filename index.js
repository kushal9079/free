
        let accounts = [];
        let mnemonicVisible = true;
        
        document.getElementById('generateBtn').addEventListener('click', function() {
            // Generate a mock mnemonic (in reality, this would come from your backend)
            const mockMnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
            
            // Display the mnemonic
            const mnemonicContainer = document.getElementById('mnemonicContainer');
            const mnemonicPhrase = document.getElementById('mnemonicPhrase');
            
            mnemonicPhrase.innerHTML = '';
            mockMnemonic.split(' ').forEach((word, i) => {
                const wordElement = document.createElement('div');
                wordElement.className = 'mnemonic-word';
                wordElement.textContent = `${i+1}. ${word}`;
                mnemonicPhrase.appendChild(wordElement);
            });
            
            mnemonicContainer.style.display = 'block';
            
            
            document.getElementById('progressContainer').style.display = 'flex';
            
           
            accounts = [];
            document.getElementById('accountsList').innerHTML = '';
            
           
            generateAccount(0);
        });
        
        document.getElementById('nextAccountBtn').addEventListener('click', function() {
            const current = parseInt(document.getElementById('currentAccount').textContent);
            if (current < 8) {
                generateAccount(current);
            }
        });
        
        document.getElementById('toggleMnemonic').addEventListener('click', function() {
            const words = document.querySelectorAll('.mnemonic-word');
            const toggleButton = document.getElementById('toggleMnemonic');
            
            mnemonicVisible = !mnemonicVisible;
            
            words.forEach(word => {
                if (mnemonicVisible) {
                    word.classList.remove('hidden');
                } else {
                    word.classList.add('hidden');
                }
            });
            
            if (mnemonicVisible) {
                toggleButton.innerHTML = '<i class="fas fa-eye"></i> Hide Phrase';
            } else {
                toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i> Show Phrase';
            }
        });
        
        function generateAccount(index) {
           
            document.getElementById('currentAccount').textContent = index + 1;
            document.getElementById('progressFill').style.width = `${(index + 1) * 12.5}%`;
            

            const mockPublicKey = `Hc${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 8)}`;
            const mockPrivateKey = `[${index}]${Math.random().toString(36).substring(2, 20)}${Math.random().toString(36).substring(2, 20)}${Math.random().toString(36).substring(2, 10)}`;
            
            const account = {
                index: index,
                publicKey: mockPublicKey,
                privateKey: mockPrivateKey
            };
            
            accounts.push(account);
            
            renderAccounts();
            
          
            if (index === 7) {
                document.getElementById('progressContainer').style.display = 'none';
            }
        }
        
        function deleteAccount(index) {
            // Find the account and remove it
            const accountIndex = accounts.findIndex(acc => acc.index === index);
            if (accountIndex !== -1) {
                // Add animation to the card
                const card = document.querySelector(`.account-card[data-index="${index}"]`);
                if (card) {
                    card.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => {
                        accounts.splice(accountIndex, 1);
                        renderAccounts();
                    }, 300);
                }
            }
        }
        
        function renderAccounts() {
            const accountsList = document.getElementById('accountsList');
            
            if (accounts.length === 0) {
                accountsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-wallet"></i>
                        <p>No accounts generated yet. Click "Generate New Wallet" to get started.</p>
                    </div>
                `;
                return;
            }
            
            accountsList.innerHTML = '';
            
            accounts.forEach(account => {
                const accountCard = document.createElement('div');
                accountCard.className = 'account-card';
                accountCard.setAttribute('data-index', account.index);
                
                accountCard.innerHTML = `
                    <div class="account-header">
                        <div class="account-index">Account ${account.index}</div>
                        <div class="account-actions">
                            <button class="btn" data-key="${account.publicKey}">
                                <i class="fas fa-copy"></i> Copy Address
                            </button>
                            <button class="btn btn-delete" onclick="deleteAccount(${account.index})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                    <div class="account-content">
                        <div class="account-field">
                            <div class="field-label">
                                <i class="fas fa-key"></i> Public Key
                            </div>
                            <div class="field-value">${account.publicKey}</div>
                        </div>
                        <div class="account-field">
                            <div class="field-label">
                                <i class="fas fa-lock"></i> Private Key (Hex)
                            </div>
                            <div class="field-value">${account.privateKey}</div>
                        </div>
                    </div>
                    <button class="btn" data-key="${account.privateKey}">
                        <i class="fas fa-copy"></i> Copy Private Key
                    </button>
                `;
                
                accountsList.appendChild(accountCard);
            });
            
            // Add event listeners to copy buttons
            document.querySelectorAll('.btn[data-key]').forEach(button => {
                button.addEventListener('click', function() {
                    const textToCopy = this.getAttribute('data-key');
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        const originalText = this.innerHTML;
                        this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        setTimeout(() => {
                            this.innerHTML = originalText;
                        }, 1500);
                    });
                });
            });
            
            // Scroll to the last account
            const lastAccount = accountsList.lastChild;
            if (lastAccount) {
                lastAccount.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    