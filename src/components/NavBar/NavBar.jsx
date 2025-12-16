import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AppLogo from '../AppLogo/AppLogo';
import { Stack } from '@mui/material';

// ATUALIZE: Adicione Mensagens nas páginas (requireLogin: true)
const paginas = [
    {label:"Cadastrar Pet", href:"/register-pet", requireLogin:true},
    {label:"Buscar Pets", href:"/search-pets", requireLogin:false},
    {label:"Adoções Concluídas", href:"/success-stories", requireLogin:false},
    {label:"Mensagens", href:"/mensagens", requireLogin:true},
    {label:"Favoritos", href:"/favoritos", requireLogin:true}, 
];

// ATUALIZE: Adicione Mensagens nas configurações do usuário
const configs = [
    {label:"Perfil", href:"/profile"},
    {label:"Mensagens", href:"/mensagens"},
    {label:"Sair", href:"/logout"},
];

export default function NavBar({isOpenModal, setOpenModal}) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [user, setUser] = React.useState(() => {
        // Carregar usuário do localStorage inicialmente
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    // Efeito para atualizar quando o usuário faz login/logout
    React.useEffect(() => {
        const handleStorageChange = () => {
            const savedUser = localStorage.getItem("user");
            setUser(savedUser ? JSON.parse(savedUser) : null);
        };
        
        // Ouvir eventos de login
        window.addEventListener('userLoggedIn', handleStorageChange);
        window.addEventListener('userAvatarUpdated', handleStorageChange);
        
        // Ouvir mudanças no localStorage (de outras abas)
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('userLoggedIn', handleStorageChange);
            window.removeEventListener('userAvatarUpdated', handleStorageChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/";
    };

    return (
        <AppBar position="fixed">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                        component="a"
                        href="/"
                    >
                        <AppLogo />
                        <Typography variant='h5' sx={{ fontFamily: 'monospace', marginBottom: '-5px', marginLeft: '.25em' }}>MIAUDOTE</Typography>
                    </IconButton>

                    <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {paginas.map(({label, href, requireLogin}, index) => (
                                (requireLogin && !(user && user.logado)) ? <React.Fragment key={index}></React.Fragment> :
                                <MenuItem key={index} onClick={handleCloseNavMenu}>
                                    <Button
                                        sx={{ textAlign: 'center' }}
                                        component="a"
                                        size="small"
                                        href={href}
                                    >
                                        {label}
                                    </Button>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        component="a"
                        href="/"
                        disableRipple
                        sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}
                    >
                        <AppLogo />
                        <Typography variant='h5' sx={{ fontFamily: 'monospace', marginBottom: '-5px', marginLeft: '.25em' }}>MIAUDOTE</Typography>
                    </IconButton>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {paginas.map(({label, href, requireLogin}, index) => (
                            (requireLogin && !(user && user.logado)) ? <React.Fragment key={index}></React.Fragment> :
                            <Button
                                key={index}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block', paddingTop: '12px' }}
                                component="a"
                                href={href}
                            >
                                {label}
                            </Button>
                        ))}
                    </Box>
                    <Box>
                        {
                            (user && user.logado) ? (
                                <Tooltip title="Abrir menu do usuário">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar 
                                            alt={user.name || "Usuário"} 
                                            src={user.avatar || ""}
                                            sx={{ 
                                                width: 42, 
                                                height: 42,
                                                bgcolor: !user.avatar ? 'primary.light' : 'transparent',
                                                border: '2px solid rgba(255,255,255,0.8)'
                                            }}
                                        >
                                            {/* Mostra inicial se não tiver foto */}
                                            {!user.avatar && user.name && user.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Stack direction="Row">
                                    <Button color="inherit" component="a" href='/cadastro-usuario'>Cadastrar</Button>
                                    <Button color="inherit" onClick={() => setOpenModal(!isOpenModal)}>Login</Button>
                                </Stack>
                            )
                        }

                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {configs.map(({label, href}, index) => {
                                if (label === "Sair") {
                                    return (
                                        <MenuItem key={index} onClick={() => {
                                            handleCloseUserMenu();
                                            handleLogout();
                                        }}>
                                            <Typography sx={{ textAlign: 'center', color: 'error.main' }}>
                                                {label}
                                            </Typography>
                                        </MenuItem>
                                    );
                                }
                                
                                return (
                                    <MenuItem key={index} onClick={handleCloseUserMenu}>
                                        <Typography
                                            sx={{ textAlign: 'center', textDecoration: 'none' }}
                                            component="a"
                                            color='inherit'
                                            href={href}
                                        >
                                            {label}
                                        </Typography>
                                    </MenuItem>
                                );
                            })}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}